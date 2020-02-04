/*!
 * @copyright Card Librarian Team 2020
 */

import { Logger } from '@flyacts/backend';
import config from 'config';
import minimist = require('minimist');
import * as sqlite from 'sqlite';
import { createConnection } from 'typeorm';

import { CardEntity } from '../src/entities/card.entity';
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

        const sets = await db.all('SELECT * FROM sets');

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

        const cards = await db.all('SELECT * FROM cards');
        let counter = 0;
        for (const card of cards) {
            let cardEntity = await connection
                .getRepository(CardEntity)
                .createQueryBuilder('c')
                .innerJoin('c.set', 'c__s')
                .where('c.name = :name', { name: card.name })
                .andWhere('c__s.code = :code', { code: card.setCode })
                .getOne();

            if (!(cardEntity instanceof CardEntity)) {
                cardEntity = new CardEntity();
            }

            cardEntity.importData = JSON.stringify(card);
            cardEntity.name = card.name;
            cardEntity.manaCost = card.manaCost;
            cardEntity.types = card.types;

            const set = await connection
                .getRepository(SetEntity)
                .createQueryBuilder('s')
                .where('s.code = :code', { code: card.setCode })
                .getOne();

            if (!(set instanceof SetEntity)) {
                throw new Error(`Could not find set ${card.setCode}`);
            }

            cardEntity.set = set;
            cardEntity.colors = card.colors;
            cardEntity.manaCost = card.manaCost;

            await connection.manager.save(cardEntity);
            counter += 1;
            if ((counter % 200) === 0) {
                logger.info(`Imported ${counter} of ${cards.length}`);
            }
        }

        process.exit(0);
    } catch (error) {
        logger.error('Failed to notify Slack', error);
        process.exit(1);
    }
})();
