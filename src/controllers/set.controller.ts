/*!
 * @copyright Card Librarian Team 2020
 */

import { Controller, CurrentUser, Get } from '@flyacts/routing-controllers';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { SetEntity } from '../entities/set.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import SetOverviewPage from '../templates/pages/set-overview.page';


/**
 * Controller for sets
 */
@Service()
@Controller('/sets')
export class SetController {
    public constructor(
        private connection: Connection,
    ) { }

    /**
     * Return all sets
     */
    @Get('/')
    public async getAllSets(
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const sets = await this
            .connection
            .getRepository(SetEntity)
            .createQueryBuilder('s')
            .orderBy('s.name', 'ASC')
            .getMany();

        return react.renderToStaticMarkup(
            React.createElement(
                SetOverviewPage,
                {
                    sets,
                    currentUser,
                },
            ),
        );
    }
}
