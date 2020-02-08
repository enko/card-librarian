/*!
 * @copyright Card Librarian Team 2020
 */

import { Logger } from '@flyacts/backend';
import { UserEntity } from '@flyacts/backend-user-management';
import config = require('config');
import minimist = require('minimist');
import { serializeError } from 'serialize-error';
import { createConnection } from 'typeorm';

import { UserExtensionEntity } from '../src/entities/user-extension.entity';

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();

    logger.info('Adding user');

    try {

        const args = minimist((process.argv.slice(2)));

        const typeOrmConfig = {
            ...require('../ormconfig.json'),
            ...config.get<Object>('database'),
        };

        const connection = await createConnection(typeOrmConfig);

        const username = args.username;
        const firstname = args.firstname;
        const lastname = args.lastname;
        const password = args.password;
        const email = args.email;

        const userExtension = new UserExtensionEntity();
        const user = new UserEntity();
        userExtension.firstname = firstname;
        userExtension.lastname = lastname;
        user.username = username;
        await user.setPassword(password);
        user.email = email;
        user.realm = 'app';

        await connection.manager.save(user);

        userExtension.user = user;

        await connection.manager.save(userExtension);

    } catch (error) {
        logger.error('Failed to create user', serializeError(error));
        process.exit(-1);
    }
})();
