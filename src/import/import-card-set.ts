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
import * as shell from 'shelljs';
import { createConnection } from 'typeorm';

// tslint:disable-next-line
(async function () {
    const logger = new Logger();
    try {
        logger.info('Welcome to the import card set');
        const args = minimist((process.argv.slice(2)));

        const typeOrmConfig = {
            ...require('../../ormconfig.json'),
            ...config.get<Object>('database'),
        };

        const connection = await createConnection(typeOrmConfig);

        if (!(Array.isArray(args._) && args._.length === 1)) {
            throw new Error('database file not passed along?!');
        }

        const fileName = path.resolve(__dirname, '../..', args._[0]);

        await fs.access(fileName);

        logger.info(`Importing database ${fileName}`);

        const pgLoaderConfigTemplate = await fs.readFile(path.resolve(__dirname, './loader-config.template'), 'utf-8');

        await fs.writeFile(
            path.resolve(__dirname, './loader-config'),
            pgLoaderConfigTemplate.replace('<path-to-sqlite>', fileName),
        );

        shell.cd(__dirname);
        shell.exec('pgloader loader-config');

        const start = moment();

        const qr = connection.createQueryRunner();
        await qr.startTransaction();

        const query = await fs.readFile(path.resolve(__dirname, './queries.sql'), 'utf-8');

        await qr.manager.query(query);

        await qr.commitTransaction();

        logger.info(`Finished import. It took ${moment().diff(start, 'second')} seconds`);

        process.exit(0);
    } catch (error) {
        logger.error('Failed to import cards', serializeError(error));
        process.exit(1);
    }
})();
