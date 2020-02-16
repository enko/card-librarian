/*!
 * @copyright Card Librarian Team 2020
 */

import {
    Authorized,
    Controller,
    CurrentUser,
    FormField,
    Get,
    Post,
    Res,
} from '@flyacts/routing-controllers';
import { validate } from 'class-validator';
import { Response } from 'express';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { DeckEntity } from '../entities/deck.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import { DeckProvider } from '../providers/deck.provider';
import DeckOverviewPage from '../templates/pages/deck-overview.page';

/**
 * A controller for decks
 */
@Service()
@Controller('/decks')
export class DeckController {
    public constructor(
        private connection: Connection,
        private deckProvider: DeckProvider,
    ) { }

    /**
     * Return all the decks
     */
    @Get('/')
    public async getDecks(
        @CurrentUser() currentUser?: UserExtensionEntity,
    ) {
        const decks = await this.deckProvider.getDecks(currentUser);

        return react.renderToStaticMarkup(
            React.createElement(
                DeckOverviewPage,
                {
                    decks,
                    currentUser,
                },
            ),
        );

    }

    /**
     * Persist a deck to the database
     */
    @Post()
    @Authorized()
    public async saveDeck(
        @Res() response: Response,
        @FormField('name') name: string,
        @FormField('isPublic') isPublic: string,
        @CurrentUser() currentUser?: UserExtensionEntity,
    ) {
        const deck = new DeckEntity();
        deck.name = name;
        deck.isPublic = isPublic === 'on';

        const validationErrors = await validate(deck);

        if (validationErrors.length > 0) {
            return react.renderToStaticMarkup(
                React.createElement(
                    DeckOverviewPage,
                    {
                        decks: await this.deckProvider.getDecks(currentUser),
                        currentUser,
                        validationErrors,
                    },
                ),
            );
        }

        await this.connection.manager.save(deck);

        response.status(303);
        response.header('Location', '/decks');
        return;
        // return response;
    }
}
