/*!
 * @copyright Card Librarian Team 2020
 */

import { Backend } from '@flyacts/backend';
import { MediaConfiguration } from '@flyacts/backend-media-management';
import { CreateContextMiddleware, UserManagementMetadata } from '@flyacts/backend-user-management';
import config from 'config';
import * as express from 'express';
import * as fs from 'fs-extra';
import i18next from 'i18next';
import * as path from 'path';
import { initReactI18next } from 'react-i18next';
import { PackageJson } from 'type-fest';
import Container from 'typedi';

import { DashboardController } from './controllers/dashboard.controller';
import { DeckController } from './controllers/deck.controller';
import { LibraryController } from './controllers/library.controller';
import { SetController } from './controllers/set.controller';
import { UserController } from './controllers/user.controller';
import { UserExtensionEntity } from './entities/user-extension.entity';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { ChangeLanguageMiddleware } from './middlewares/switch-language.middleware';

const controllers = [
    DashboardController,
    LibraryController,
    UserController,
    DeckController,
    SetController,
];

UserManagementMetadata.instance.userClass = UserExtensionEntity;
UserManagementMetadata.instance.enforceOwnableContent = true;

if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development';
}

/**
 * Start the app
 */
export async function startApp() {
    await initiallizeTranslation();

    const typeOrmConfig = {
        ...require('../ormconfig.json'),
        ...config.get<object>('database'),
    };

    const packageJson = require('../package.json') as PackageJson;

    const mediaLocation = config.get<string>('media.directory');
    if (!(await fs.pathExists(mediaLocation))) {
        throw new Error('Media Location does not exists');
    }

    const mediaConfig = new MediaConfiguration(mediaLocation);
    mediaConfig.tempDir = config.get<string>('media.tmpdir');

    Container.set(MediaConfiguration, mediaConfig);

    return Backend.create(
        typeOrmConfig,
        controllers,
        [
            CreateContextMiddleware,
            ErrorHandlerMiddleware,
            ChangeLanguageMiddleware,
        ],
        {
            name: (typeof packageJson.name === 'string' ? packageJson.name : ''),
            description: (typeof packageJson.description === 'string' ? packageJson.description : ''),
            version: (typeof packageJson.version === 'string' ? packageJson.version : ''),
        },
        undefined,
        undefined,
        true,
        true,
        true,
        false,
    );

}

/**
 * Initialize the translation
 */
async function initiallizeTranslation() {
    await i18next
        .use(initReactI18next) // passes i18n down to react-i18next
        .init({
            resources: {
                en: {
                    translation: require(
                        path.resolve(
                            __dirname,
                            'translations',
                            'en.json',
                        ),
                    ),
                },
                de: {
                    translation: require(
                        path.resolve(
                            __dirname,
                            'translations',
                            'de.json',
                        ),
                    ),
                },
            },
            lng: 'de',
            fallbackLng: 'de',
            preload: ['de', 'en'],

            interpolation: {
                escapeValue: false,
            },
        });
}

if (process.env.NODE_ENV !== 'test') {
    (async function() {
        try {
            const be = await startApp();

            be.express.use('/assets', express.static(path.resolve(__dirname, 'assets')));

            await be.start();
        } catch (error) {
            // tslint:disable-next-line
            console.error(error);

            process.exit(-1);
        }
    })();
}
