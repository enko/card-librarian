/*!
 * @copyright Card Librarian Team 2020
 */

import {
    Authorized,
    Controller,
    CurrentUser,
    FormField,
    Get,
    NotFoundError,
    Param,
    Post,
    Redirect,
    Res,
} from '@flyacts/routing-controllers';
import { validate } from 'class-validator';
import { Response } from 'express';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { CardToDeckEntity } from '../entities/card-to-deck.entity';
import { CardEntity } from '../entities/card.entity';
import { DeckEntity } from '../entities/deck.entity';
import { LegalityFormatEntity } from '../entities/legality-format.entity';
import { LegalityEntity } from '../entities/legality.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import { LegalityStatus } from '../enums/legality-status.enum';
import { CardProvider } from '../providers/card.provider';
import { DeckProvider } from '../providers/deck.provider';
import DeckAddCardsPreviewPage from '../templates/pages/deck-management/deck-add-cards-preview.page';
import DeckAddCardsPage from '../templates/pages/deck-management/deck-add-cards.page';
import DeckDetailPage from '../templates/pages/deck-management/deck-detail.page';
import DeckEditPage from '../templates/pages/deck-management/deck-edit.page';
import DeckOverviewPage from '../templates/pages/deck-management/deck-overview.page';

/**
 * A controller for decks
 */
@Service()
@Controller('/decks')
export class DeckController {
    public constructor(
        private connection: Connection,
        private deckProvider: DeckProvider,
        private cardProvider: CardProvider,
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
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
    ) {
        const deck = new DeckEntity();
        deck.name = name;
        deck.isPublic = isPublic === 'on';

        const validationErrors = await validate(deck);

        if (validationErrors.length > 0) {
            return react.renderToStaticMarkup(
                React.createElement(
                    DeckEditPage,
                    {
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
    }

    /**
     * Fetch details about a deck
     */
    @Get('/:id([0-9]+)')
    public async getDeckDetails(
        @Param('id') id: number,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        const cards = await this
            .connection
            .getRepository(CardToDeckEntity)
            .createQueryBuilder('c2d')
            .innerJoinAndSelect('c2d.card', 'c2d__c')
            .innerJoinAndSelect('c2d__c.set', 'c2c__c__s')
            .innerJoinAndSelect('c2d.deck', 'c2d__d')
            .andWhere('c2d__d.id = :deckId', { deckId: deck.id })
            .getMany();

        const legalities: LegalityFormatEntity[] = [];

        const formats = await this.connection.manager.find(LegalityFormatEntity);

        for (const format of formats) {
            const legalAmount = await this
                .connection
                .getRepository(LegalityEntity)
                .createQueryBuilder('l')
                .innerJoin('l.card', 'l__c')
                .innerJoin('l__c.deckAssignments', 'l__c__da')
                .innerJoin('l.legalityFormat', 'l__lf')
                .where('l__c__da.deck_id = :deckId', { deckId: deck.id })
                .andWhere('l.status = :status', { status: LegalityStatus.Legal })
                .andWhere('l__lf.id = :formatId', { formatId: format.id })
                .getMany();

            if (legalAmount.length === cards.length) {
                legalities.push(format);
            }
        }

        return react.renderToStaticMarkup(
            React.createElement(
                DeckDetailPage,
                {
                    deck,
                    currentUser,
                    cards,
                    legalities,
                },
            ),
        );
    }


    /**
     * Rendere a form for creating a deck
     */
    @Get('/add')
    @Authorized()
    public async getDeckDetailForm(
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        return react.renderToStaticMarkup(
            React.createElement(
                DeckEditPage,
                {
                    currentUser,
                },
            ),
        );
    }

    /**
     * Rendere a form for creating a deck
     */
    @Get('/:id([0-9]+)/edit')
    @Authorized()
    public async getDeckEditDetailForm(
        @Param('id') id: number,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(
            React.createElement(
                DeckEditPage,
                {
                    deck,
                    currentUser,
                },
            ),
        );
    }

    /**
     * Rendere a form for creating a deck
     */
    @Get('/:id([0-9]+)/cards/add')
    @Authorized()
    public async getDeckAddCardsForm(
        @Param('id') id: number,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(
            React.createElement(
                DeckAddCardsPage,
                {
                    deck,
                    currentUser,
                },
            ),
        );
    }

    /**
     * Update a existing deck
     */
    @Post('/:id([0-9]+)')
    @Authorized()
    public async updateDeck(
        @Param('id') id: number,
        @FormField('name') name: string,
        @FormField('isPublic') isPublic: string,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @Res() response: Response,
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        deck.name = name;
        deck.isPublic = isPublic === 'on';

        const validationErrors = await validate(deck);

        if (validationErrors.length > 0) {
            return react.renderToStaticMarkup(
                React.createElement(
                    DeckEditPage,
                    {
                        deck,
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
    }


    /**
     * Preview adding cards to a deck
     */
    @Post('/:id([0-9]+)/cards/add')
    @Authorized()
    public async previewAddCardsToDeck(
        @Param('id') id: number,
        @FormField('cards') cards: string,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        const cardAssignments = await this.cardProvider.resolveCards(cards);

        return react.renderToStaticMarkup(
            React.createElement(
                DeckAddCardsPreviewPage,
                {
                    deck,
                    currentUser,
                    cardAssignments,
                },
            ),
        );
    }

    /**
     * Submit cards to a deck
     */
    @Post('/:id([0-9]+)/cards/submit')
    @Authorized()
    @Redirect('/decks')
    public async submitCardsToDeck(
        @Param('id') id: number,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @FormField('card_id') cardIDValues?: string[],
        @FormField('amount') amountValues?: string[],
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        const amounts: { [index: string]: { amount: number } } = {};

        if (
            Array.isArray(cardIDValues) &&
            Array.isArray(amountValues)) {
            let index = 0;
            for (const cardID of cardIDValues) {

                const currentAmount = Number.parseInt(amountValues[index]);

                if (!Number.isNaN(currentAmount)) {
                    amounts[cardID] = {
                        amount: currentAmount,
                    };
                }

                index += 1;
            }
        }

        for (const key of Object.keys(amounts)) {
            const card = await this
                .connection
                .getRepository(CardEntity)
                .createQueryBuilder('c')
                .where('id = :id', { id: key })
                .getOne();

            if (!(card instanceof CardEntity)) {
                continue;
            }

            let association = await this
                .connection
                .getRepository(CardToDeckEntity)
                .createQueryBuilder('c2d')
                .innerJoinAndSelect('c2d.card', 'c2d__c')
                .innerJoinAndSelect('c2d.deck', 'c2d__d')
                .where('c2d__c.id = :cardId')
                .andWhere('c2d__d.id = :deckId')
                .setParameters({
                    cardId: card.id,
                    deckId: deck.id,
                })
                .getOne();

            if (association instanceof CardToDeckEntity) {
                association.amount += amounts[key].amount;
            } else {
                association = new CardToDeckEntity();
                association.card = card;
                association.deck = deck;
                association.amount = amounts[key].amount;
            }

            await this.connection.manager.save(association);
        }

        return `/decks/${deck.id}`;
    }
}
