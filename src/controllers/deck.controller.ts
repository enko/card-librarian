/*!
 * @copyright Card Librarian Team 2020
 */

import { Logger } from '@flyacts/backend';
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
import { serializeError } from 'serialize-error';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { CardToDeckEntity } from '../entities/card-to-deck.entity';
import { CardEntity } from '../entities/card.entity';
import { DeckEntity } from '../entities/deck.entity';
import { LegalityFormatEntity } from '../entities/legality-format.entity';
import { LegalityEntity } from '../entities/legality.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import { CardToDeckType } from '../enums/card-to-deck-type.enum';
import { LegalityStatus } from '../enums/legality-status.enum';
import { CardProvider } from '../providers/card.provider';
import { DeckProvider } from '../providers/deck.provider';
import DeckAddCardsPreviewPage from '../templates/pages/deck-management/deck-add-cards-preview.page';
import DeckAddCardsPage from '../templates/pages/deck-management/deck-add-cards.page';
import DeckAssignmentDeletePage from '../templates/pages/deck-management/deck-assignment-delete.page';
import DeckAssignmentEditPage from '../templates/pages/deck-management/deck-assignment-edit.page';
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
        private logger: Logger,
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
            .innerJoinAndSelect('c2d__c.set', 'c2d__c__s')
            .innerJoinAndSelect('c2d.deck', 'c2d__d')
            .andWhere('c2d__d.id = :deckId', { deckId: deck.id })
            .orderBy('c2d.type', 'ASC')
            .addOrderBy('c2d__c__s.name', 'ASC')
            .addOrderBy('c2d__c.set_number', 'ASC')
            .getMany();

        let cardAmount = 0;

        for (const card of cards) {
            cardAmount += card.amount;
        }

        const legalities: LegalityFormatEntity[] = [];

        const formats = await this.connection.manager.find(LegalityFormatEntity);

        for (const format of formats) {
            const legalAssignments = await this
                .connection
                .getRepository(LegalityEntity)
                .createQueryBuilder('l')
                .innerJoinAndSelect('l.card', 'l__c')
                .innerJoinAndSelect('l__c.deckAssignments', 'l__c__da')
                .innerJoinAndSelect('l.legalityFormat', 'l__lf')
                .where('l__c__da.deck_id = :deckId', { deckId: deck.id })
                .andWhere('l.status = :status', { status: LegalityStatus.Legal })
                .andWhere('l__lf.id = :formatId', { formatId: format.id })
                .getMany();

            let legalAmount = 0;

            for (const assignment of legalAssignments) {
                for (const deckAsssignment of assignment.card.deckAssignments) {
                    legalAmount += deckAsssignment.amount;
                }
            }

            if (cardAmount === legalAmount) {
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
    // tslint:disable-next-line
    public async submitCardsToDeck(
        @Param('id') id: number,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @FormField('card_id') cardIDValues?: string[],
        @FormField('amount') amountValues?: string[],
        @FormField('type') typeValues?: string[],
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        const amounts: { [index: string]: { amount: number, type: string } } = {};

        if (
            Array.isArray(cardIDValues) &&
            Array.isArray(typeValues) &&
            Array.isArray(amountValues)) {
            let index = 0;
            for (const cardID of cardIDValues) {

                const currentAmount = Number.parseInt(amountValues[index]);
                const currentType = typeValues[index];

                if (!Number.isNaN(currentAmount)) {
                    amounts[cardID] = {
                        amount: currentAmount,
                        type: currentType,
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
                .andWhere('c2d.type = :type')
                .setParameters({
                    cardId: card.id,
                    deckId: deck.id,
                    type: amounts[key].type,
                })
                .getOne();

            if (association instanceof CardToDeckEntity) {
                association.amount += amounts[key].amount;
            } else {
                association = new CardToDeckEntity();
                association.card = card;
                association.deck = deck;
                if (amounts[key].type === 'main') {
                    association.type = CardToDeckType.Main;
                } else if (amounts[key].type === 'sideboard') {
                    association.type = CardToDeckType.SideBoard;
                }
                association.amount = amounts[key].amount;
            }

            const validationErrors = await validate(association);

            if (validationErrors.length > 0) {
                this.logger.error('Failed to add association', validationErrors.map(serializeError));
                continue;
            }

            await this.connection.manager.save(association);
        }

        return `/decks/${deck.id}`;
    }

    /**
     * Delete a deck
     */
    @Authorized()
    @Redirect('/decks')
    @Post('/:id([0-9]+)/delete')
    public async deleteDeck(
        @Param('id') id: number,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const deck = await this.deckProvider.getDeck(id, currentUser);

        if (!(deck instanceof DeckEntity)) {
            throw new NotFoundError();
        }

        const qr = this.connection.createQueryRunner();

        try {
            await qr.startTransaction();

            if (Array.isArray(deck.cardAssociations)) {
                for (const assignment of deck.cardAssociations) {
                    await qr.manager.remove(assignment);
                }
            }

            await qr.manager.remove(deck);

            await qr.commitTransaction();
        } catch (error) {
            this.logger.error('Failed to delete deck', serializeError(error));
            await qr.rollbackTransaction();
        } finally {
            await qr.release();
        }
    }

    /**
     * Present a form to edit a deck
     */
    @Authorized()
    @Get('/:deckId([0-9]+)/cards/:cardAssignmentId([0-9]+)/edit')
    public async deckAssignmentEditPage(
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @Param('deckId') deckId: number,
        @Param('cardAssignmentId') cardAssignmentId: number,
    ) {
        const assignment = await this.deckProvider.getCardAssignment(
            deckId,
            cardAssignmentId,
            currentUser,
        );

        if (!(assignment instanceof CardToDeckEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(
            React.createElement(
                DeckAssignmentEditPage,
                {
                    assignment,
                    currentUser,
                },
            ),
        );
    }

    /**
     * Present a form to edit a deck
     */
    @Authorized()
    @Post('/:deckId([0-9]+)/cards/:cardAssignmentId([0-9]+)/edit')
    public async updateDeckAssignment(
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @Param('deckId') deckId: number,
        @Param('cardAssignmentId') cardAssignmentId: number,
        @FormField('amount') amountData: string,
        @FormField('type') typeData: string,
        @Res() response: Response,
    ) {
        const assignment = await this.deckProvider.getCardAssignment(
            deckId,
            cardAssignmentId,
            currentUser,
        );

        if (!(assignment instanceof CardToDeckEntity)) {
            throw new NotFoundError();
        }

        let assignmentChanged = false;
        assignment.amount = Number.parseInt(amountData);
        if ((typeData === CardToDeckType.Main) && (assignment.type !== CardToDeckType.Main)) {
            assignmentChanged = true;
            assignment.type = CardToDeckType.Main;
        } else if ((typeData === CardToDeckType.SideBoard) && (assignment.type !== CardToDeckType.SideBoard)) {
            assignmentChanged = true;
            assignment.type = CardToDeckType.SideBoard;
        }

        const validationErrors = await validate(assignment);

        if (validationErrors.length > 0) {
            return react.renderToStaticMarkup(
                React.createElement(
                    DeckAssignmentEditPage,
                    {
                        assignment,
                        currentUser,
                        validationErrors,
                    },
                ),
            );
        }

        if (assignmentChanged === true) {
            const existingAssignment = await this
                .deckProvider
                .getCardAssignmentByCardAndType(
                    assignment.deck.id,
                    assignment.card.id,
                    assignment.type,
                );

            if (existingAssignment instanceof CardToDeckEntity) {
                existingAssignment.amount += assignment.amount;
                await this.connection.manager.save(existingAssignment);
                await this.connection.manager.remove(assignment);
            } else {
                await this.connection.manager.save(assignment);
            }
        } else {
            await this.connection.manager.save(assignment);
        }

        response.status(303);
        response.header('Location', `/decks/${assignment.deck.id}`);
        return;
    }

    /**
     * Present a confirmation page to delete a deck assignment
     */
    @Authorized()
    @Get('/:deckId([0-9]+)/cards/:cardAssignmentId([0-9]+)/delete')
    public async deckAssignmentDeletePage(
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @Param('deckId') deckId: number,
        @Param('cardAssignmentId') cardAssignmentId: number,
    ) {
        const assignment = await this.deckProvider.getCardAssignment(
            deckId,
            cardAssignmentId,
            currentUser,
        );

        if (!(assignment instanceof CardToDeckEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(
            React.createElement(
                DeckAssignmentDeletePage,
                {
                    assignment,
                    currentUser,
                },
            ),
        );
    }

    /**
     * Present a confirmation page to delete a deck assignment
     */
    @Authorized()
    @Post('/:deckId([0-9]+)/cards/:cardAssignmentId([0-9]+)/delete')
    public async deleteDeckAssignment(
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @Param('deckId') deckId: number,
        @Param('cardAssignmentId') cardAssignmentId: number,
        @Res() response: Response,
    ) {
        const assignment = await this.deckProvider.getCardAssignment(
            deckId,
            cardAssignmentId,
            currentUser,
        );

        if (!(assignment instanceof CardToDeckEntity)) {
            throw new NotFoundError();
        }

        response.status(303);
        response.header('Location', `/decks/${assignment.deck.id}`);
        return;
    }
}
