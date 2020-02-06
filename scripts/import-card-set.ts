/*!
 * @copyright Card Librarian Team 2020
 */

import { Logger } from '@flyacts/backend';
import config from 'config';
import minimist = require('minimist');
import { serializeError } from 'serialize-error';
import * as sqlite from 'sqlite';
import { createConnection } from 'typeorm';

import { CardEntity } from '../src/entities/card.entity';
import { ForeignCardDataEntity } from '../src/entities/foreign-card-data.entity';
import { SetEntity } from '../src/entities/set.entity';


// tslint:disable-next-line
(async function () {
    const logger = new Logger();
    try {
        const args = minimist((process.argv.slice(2)));

        const typeOrmConfig = {
            ...require('../ormconfig.json'),
            ...config.get<Object>('database'),
        };

        const connection = await createConnection(typeOrmConfig);

        if (!(Array.isArray(args._) && args._.length === 1)) {
            throw new Error('database file not passed along?!');
        }

        const fileName = args._[0];

        const db = await sqlite.open(fileName);

        const sets = await db.all('SELECT * FROM sets AS s ORDER BY s.name');

        for (const set of sets) {
            let setEntity = await connection
                .getRepository(SetEntity)
                .createQueryBuilder('s')
                .where('code = :code', { code: set.code })
                .getOne();

            if (!(setEntity instanceof SetEntity)) {
                setEntity = new SetEntity();
            }

            setEntity.code = set.code;
            setEntity.name = set.name;
            setEntity.importData = JSON.stringify(set);

            await connection.manager.save(setEntity);
            logger.info(`Imported set ${set.name}`);
        }

        const importCards = await db.all('SELECT * FROM cards');

        logger.info('Caching all sets');
        const allSets = await connection
            .getRepository(SetEntity)
            .createQueryBuilder('s')
            .getMany();

        logger.info('Caching all cards');
        let allCards = await connection
            .getRepository(CardEntity)
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.set', 'c__s')
            .getMany();
        let counter = 0;
        for (const card of importCards) {
            let cardEntity = allCards.filter((item) => item.uuid === card.uuid).pop();

            if (!(cardEntity instanceof CardEntity)) {
                cardEntity = new CardEntity();
            }

            cardEntity.importData = JSON.stringify(card);
            cardEntity.name = card.name;
            cardEntity.manaCost = card.manaCost;
            cardEntity.types = card.types;

            const set = allSets.filter(item => item.code === card.setCode).pop();

            if (!(set instanceof SetEntity)) {
                throw new Error(`Could not find set ${card.setCode}`);
            }

            cardEntity.set = set;
            cardEntity.colors = card.colors;
            cardEntity.manaCost = card.manaCost;
            cardEntity.uuid = card.uuid;

            await connection.manager.save(cardEntity);
            counter += 1;
            if ((counter % 200) === 0) {
                logger.info(`Imported ${counter} of ${importCards.length}`);
            }
        }

        logger.info('Caching all cards');
        allCards = await connection
            .getRepository(CardEntity)
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.set', 'c__s')
            .getMany();

        logger.info('Caching all foreign card data');
        const allForeignCardData = await connection
            .getRepository(ForeignCardDataEntity)
            .createQueryBuilder('fcd')
            .innerJoinAndSelect('fcd.card', 'fcd__c')
            .getMany();

        const foreignCards = await db.all('SELECT * FROM foreign_data');
        counter = 0;
        const qr = connection.createQueryRunner();
        await qr.startTransaction();
        for (const foreignCard of foreignCards) {
            const card = allCards.filter((item) => item.uuid === foreignCard.uuid).pop();

            if (!(card instanceof CardEntity)) {
                continue;
            }

            const foreignCardData = allForeignCardData
                .filter((item) =>
                    (item.card.id === card.id) &&
                    (item.language === foreignCard.language),
                )
                .pop();

            if (typeof foreignCardData === 'undefined') {
                await qr
                    .query(`INSERT INTO card_management.foreign_card_data(
    card_id,
    flavor_text,
    name,
    language,
    type,
    text,
    import_data
)
VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                        card.id,
                        foreignCard.flavorText,
                        foreignCard.name,
                        foreignCard.language,
                        foreignCard.type,
                        foreignCard.text,
                        JSON.stringify(foreignCard),
                    ]);
            } else {
                await qr.query(`UPDATE card_management.foreign_card_data
SET
    flavor_text = $1,
    name = $2,
    language = $3,
    type = $4,
    text = $5,
    import_data = $6
WHERE id = $7`, [
                    foreignCard.flavorText,
                    foreignCard.name,
                    foreignCard.language,
                    foreignCard.type,
                    foreignCard.text,
                    JSON.stringify(foreignCard),
                    foreignCardData.id,
                ]);
            }

            counter += 1;
            if ((counter % 1000) === 0) {
                logger.info(`Imported ${counter} of ${foreignCards.length}`);
            }
        }

        await qr.commitTransaction();

        process.exit(0);
    } catch (error) {
        logger.error('Failed to import cards', serializeError(error));
        process.exit(1);
    }
})();
