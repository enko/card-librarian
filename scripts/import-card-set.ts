/*!
 * @copyright FLYACTS GmbH 2018
 */

import { Logger } from '@flyacts/backend';
import minimist = require('minimist');
import * as config from 'config';
import { createConnection } from 'typeorm';
import { CardEntity } from '../src/entities/card.entity';

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

        console.dir(connection);

        if (!(Array.isArray(args._) && args._.length === 1)) {
            throw new Error('JSON file not passed along?!')
        }

        const fileName = args._[0];

        try {
            require(fileName);
        } catch (error) {
            throw new Error('Could not parse JSON');
        }

        const contents = require(fileName);

        logger.info(`Importing ${contents.cards.length} cards`);

        for (const card of contents.cards) {
            const cardEntity = new CardEntity();
            cardEntity.name = card.name;
            cardEntity.manaCost = card.manaCost;
            cardEntity.colors = card.colors.join(', ');
            cardEntity.importData = card;

            await connection.manager.save(cardEntity);
        }
        process.exit(0);
    } catch (error) {
        logger.error('Failed to notify Slack', error);
        process.exit(1);
    }
})();
