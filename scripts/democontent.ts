/*!
 * @copyright Card Librarian Team 2020
 */

import { Logger } from '@flyacts/backend';
import { UserEntity } from '@flyacts/backend-user-management';
import config = require('config');
import { serializeError } from 'serialize-error';
import { createConnection } from 'typeorm';

import { CardEntity } from '../src/entities/card.entity';
import { SetEntity } from '../src/entities/set.entity';
import { UserExtensionEntity } from '../src/entities/user-extension.entity';

// tslint:disable-next-line:no-floating-promises
(async function() {
    const logger = new Logger();

    logger.info('Adding some Democontent to work with');

    try {
        const typeOrmConfig = {
            ...require('../ormconfig.json'),
            ...config.get<Object>('database'),
        };

        const connection = await createConnection(typeOrmConfig);

        const username = 'tom';
        const firstname = 'Tom';
        const lastname = 'Tester';
        // tslint:disable-next-line
        const password = '123456';
        const email = 'tom.tester@test.test';

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

        const set = new SetEntity();
        set.name = 'Unglued';
        set.code = 'UGL';

        await connection.manager.save(set);

        const card = new CardEntity();
        card.name = 'Chaos Confetti';
        card.manaCost = '{4}';
        card.types = 'Artifact';
        card.set = set;
        card.uuid = '6bd280d0-3259-4343-9203-3bda16444e7e';

        await connection.manager.save(card);
    } catch (error) {
        logger.error('Failed to initialize democontent', serializeError(error));
        process.exit(-1);
    }
})();
