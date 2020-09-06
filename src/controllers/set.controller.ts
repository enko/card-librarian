/*!
 * @copyright Card Librarian Team 2020
 */

import {
    Controller,
    CurrentUser,
    Get,
    NotFoundError,
    Param,
} from '@flyacts/routing-controllers';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { SetEntity } from '../entities/set.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import SetDetailPage from '../templates/pages/set-detail.page';
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

    /**
     * Display all the cards of a set
     */
    @Get('/:code')
    public async getSet(
        @Param('code') code: string,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const set = await this
            .connection
            .getRepository(SetEntity)
            .createQueryBuilder('s')
            .innerJoinAndSelect('s.cards', 's__c')
            .where('s.code = :code', { code })
            .orderBy('s__c.set_number', 'ASC')
            .getOne();

        if (!(set instanceof SetEntity)) {
            throw new NotFoundError();
        }

        if (!Array.isArray(set.cards)) {
            throw new NotFoundError();
        }


        return react.renderToStaticMarkup(
            React.createElement(
                SetDetailPage,
                {
                    set,
                    cards: set.cards,
                    currentUser,
                },
            ),
        );
    }
}
