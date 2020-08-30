/*!
 * @copyright Card Librarian Team 2020
 */

import { Logger } from '@flyacts/backend';
import config from 'config';
import * as fs from 'fs/promises';
import minimist = require('minimist');
import moment = require('moment');
import * as path from 'path';
import { serializeError } from 'serialize-error';
import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import { createConnection, QueryRunner } from 'typeorm';

import { CardEntity } from './entities/card.entity';
import { ForeignCardDataEntity } from './entities/foreign-card-data.entity';
import { LegalityFormatEntity } from './entities/legality-format.entity';
import { LegalityEntity } from './entities/legality.entity';
import { SetEntity } from './entities/set.entity';

/**
 * Import all the sets
 */
async function importSets(
    db: sqlite.Database,
    logger: Logger,
    qr: QueryRunner,
) {
    const _importSets = await db.all('SELECT * FROM sets AS s ORDER BY s.name');
    const sets = await qr
        .manager
        .getRepository(SetEntity)
        .createQueryBuilder('s')
        .getMany();

    for (const importSet of _importSets) {
        let set = sets
            .filter(item => item.code === importSet.code)
            .pop();
        if (!(set instanceof SetEntity)) {
            set = new SetEntity();
        }
        set.code = importSet.code;
        set.name = importSet.name;
        set.importData = JSON.stringify(importSet);
        await qr.manager.insert(SetEntity, set);
        logger.info(`Imported set ${importSet.name}`);
    }
}

/**
 * Import alll the cards
 */
async function importCards(
    db: sqlite.Database,
    logger: Logger,
    qr: QueryRunner,
) {
    const _importCards = await db.all('SELECT * FROM cards');

    logger.info('Caching all sets');

    const allSets = await qr
        .manager
        .getRepository(SetEntity)
        .createQueryBuilder('s')
        .getMany();
    logger.info('Caching all cards for card import');

    const allCards = await qr
        .manager
        .getRepository(CardEntity)
        .createQueryBuilder('c')
        .innerJoinAndSelect('c.set', 'c__s')
        .getMany();

    let counter = 0;

    logger.info('Starting Import');

    for (const card of _importCards) {
        let cardEntity = allCards.filter((item) => item.uuid === card.uuid).pop();

        if (!(cardEntity instanceof CardEntity)) {
            cardEntity = new CardEntity();
        }

        cardEntity.importData = JSON.stringify(card);
        cardEntity.name = card.name;
        cardEntity.manaCost = card.manaCost;
        cardEntity.types = card.types;
        cardEntity.setNumber = card.number;

        const set = allSets.filter(item => item.code === card.setCode).pop();

        if (!(set instanceof SetEntity)) {
            throw new Error(`Could not find set ${card.setCode}`);
        }

        cardEntity.set = set;
        cardEntity.colors = card.colors;
        cardEntity.manaCost = card.manaCost;
        cardEntity.uuid = card.uuid;

        await qr.manager.insert(CardEntity, cardEntity);

        counter += 1;

        if ((counter % 200) === 0) {
            logger.info(`Imported ${counter} of ${_importCards.length}`);
        }
    }
}

/**
 * Import all the card translation data
 */
async function importForeignData(
    db: sqlite.Database,
    logger: Logger,
    qr: QueryRunner,
) {
    logger.info('Caching all cards');
    const allCards = await qr
        .manager
        .getRepository(CardEntity)
        .createQueryBuilder('c')
        .innerJoinAndSelect('c.set', 'c__s')
        .getMany();

    logger.info('Caching all foreign card data');
    const allForeignCardData = await qr
        .manager
        .getRepository(ForeignCardDataEntity)
        .createQueryBuilder('fcd')
        .innerJoinAndSelect('fcd.card', 'fcd__c')
        .getMany();

    const foreignCards = await db.all('SELECT * FROM foreign_data');
    let counter = 0;

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
}

/**
 * Import all the card legalities
 */
async function importLegalities(
    db: sqlite.Database,
    logger: Logger,
    qr: QueryRunner,
) {
    logger.info('Importing legalities');

    logger.info('Caching all cards');
    const allCards = await qr
        .manager
        .getRepository(CardEntity)
        .createQueryBuilder('c')
        .innerJoinAndSelect('c.set', 'c__s')
        .getMany();

    logger.info('Caching all formats');
    const allFormats = await qr
        .manager
        .getRepository(LegalityFormatEntity)
        .createQueryBuilder('lf')
        .getMany();

    logger.info('Caching all legalities');
    const allLegalities = await qr
        .manager
        .getRepository(LegalityEntity)
        .createQueryBuilder('l')
        .innerJoinAndSelect('l.card', 'l__c')
        .innerJoinAndSelect('l.legalityFormat', 'l__lf')
        .getMany();

    logger.info('Fetching data from sqlite db');
    const _importLegalities = await db.all('SELECT * FROM legalities');

    logger.info('Starting import');
    let counter = 0;
    for (const importLegality of _importLegalities) {
        const card = allCards.filter(item => item.uuid === importLegality.uuid).pop();

        if (!(card instanceof CardEntity)) {
            logger.error(`Could not find card with uuid ${importLegality.uuid}`);
            continue;
        }

        let format = allFormats.filter(item => item.code === importLegality.format).pop();

        if (!(format instanceof LegalityFormatEntity)) {
            format = new LegalityFormatEntity();
            format.code = importLegality.format;
            format.name = importLegality.format;

            await qr.manager.save(format);

            allFormats.push(format);
        }

        let legality = allLegalities
            .filter(item => item.card.id === card.id && item.legalityFormat.id === format?.id)
            .pop();

        if (!(legality instanceof LegalityEntity)) {
            legality = new LegalityEntity();
            legality.card = card;
            legality.legalityFormat = format;
        }

        legality.status = importLegality.status;

        await qr.manager.insert(LegalityEntity, legality);

        counter += 1;
        if ((counter % 1000) === 0) {
            logger.info(`Imported ${counter} of ${_importLegalities.length} legalities`);
        }
    }
}

// tslint:disable-next-line
(async function () {
    const logger = new Logger();
    try {
        logger.info('Welcome to the import card set');
        const args = minimist((process.argv.slice(2)));

        const typeOrmConfig = {
            ...require('../ormconfig.json'),
            ...config.get<Object>('database'),
        };

        const connection = await createConnection(typeOrmConfig);

        if (!(Array.isArray(args._) && args._.length === 1)) {
            throw new Error('database file not passed along?!');
        }

        const fileName = path.resolve(__dirname, '..', args._[0]);

        await fs.access(fileName);

        logger.info(`Opening database ${fileName}`);

        const db = await sqlite.open({
            driver: sqlite3.Database,
            filename: fileName,
        });

        const start = moment();

        const qr = connection.createQueryRunner();
        await qr.startTransaction();

        const importAll = 'import-all';

        if (args[importAll] === true || args['import-sets'] === true) {
            await importSets(db, logger, qr);
        }

        if (args[importAll] === true || args['import-cards'] === true) {
            await importCards(db, logger, qr);
        }

        if (args[importAll] === true || args['import-foreign-data'] === true) {
            await importForeignData(db, logger, qr);
        }

        if (args[importAll] === true || args['import-legalities'] === true) {
            await importLegalities(db, logger, qr);
        }

        logger.info('Importing legalities');

        await qr.commitTransaction();

        logger.info(`Finished import. It took ${moment().diff(start, 'second')} seconds`);

        process.exit(0);
    } catch (error) {
        logger.error('Failed to import cards', serializeError(error));
        process.exit(1);
    }
})();
