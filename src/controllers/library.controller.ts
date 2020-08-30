/*!
 * @copyright Card Librarian Team 2020
 */

// tslint:disable:no-duplicate-string

import { uuid } from '@flyacts/backend-core-entities';
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

import { CardToLibraryEntity } from '../entities/card-to-library.entity';
import { CardEntity } from '../entities/card.entity';
import { LibraryEntity } from '../entities/library.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import { getUUIDRegEx } from '../helper/funcs';
import { CardProvider } from '../providers/card.provider';
import { LibraryProvider } from '../providers/library.provider';
import LibraryOverviewPage from '../templates/pages/library-management/libary-overview.page';
import LibraryAddCardsPage from '../templates/pages/library-management/library-add-cards.page';
import LibraryCardAddPreviewPage from '../templates/pages/library-management/library-card-add-preview.page';
import LibraryDetailPage from '../templates/pages/library-management/library-detail.page';
import LibraryEditPage from '../templates/pages/library-management/library-edit.page';


/**
 * Controller for /
 */
@Controller('/libraries')
@Service()
export class LibraryController {

    public constructor(
        private connection: Connection,
        private cardProvider: CardProvider,
        private libraryProvider: LibraryProvider,
    ) {

    }

    /**
     * returns certian health statistics
     */
    @Get()
    public async root(
        @CurrentUser() currentUser?: UserExtensionEntity,
    ) {
        const libraries = await this.libraryProvider.getLibraries(currentUser);

        return react.renderToStaticMarkup(React.createElement(
            LibraryOverviewPage,
            {
                libraries,
                currentUser,
            },
        ),
        );
    }

    /**
     * Save a library to the database
     */
    @Post()
    @Redirect('/libraries')
    public async save(
        @FormField('name') name: string,
        @FormField('is_public') isPublic: string,
    ) {
        const library = new LibraryEntity();

        library.name = name;
        library.isPublic = isPublic === 'on';

        await this.connection.manager.save(library);
    }

    /**
     * Get a library detail page
     */
    @Get(`/:id(${getUUIDRegEx()})`)
    public async getDetail(
        @Param('id') id: uuid,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const library = await this.libraryProvider.getLibrary(
            id,
            currentUser,
        );

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(
            React.createElement(LibraryDetailPage, {
                library,
                currentUser,
            }),
        );
    }

    /**
     * Preview the cards you want to add to your library
     */
    @Post(`/:id(${getUUIDRegEx()})/cards/add`)
    @Authorized()
    public async addCard(
        @Param('id') id: uuid,
        @FormField('cards') importData: string,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
    ) {
        const library = await this.libraryProvider.getLibrary(
            id,
            currentUser,
        );

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        return react
            .renderToStaticMarkup(
                React.createElement(
                    LibraryCardAddPreviewPage,
                    {
                        cards: await this.cardProvider.resolveCards(importData),
                        library,
                    },
                ),
            );
    }

    /**
     * Submit cards to your library
     */
    @Post(`/:id(${getUUIDRegEx()})/cards/submit`)
    @Redirect('/libraries')
    @Authorized()
    // tslint:disable-next-line:cognitive-complexity
    public async submitCards(
        @Param('id') id: uuid,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @FormField('card_id') cardIDValues?: string[],
        @FormField('amount') amountValues?: string[],
        @FormField('isFoil') isFoilValues?: string[],
    ) {
        const library = await this.libraryProvider.getLibrary(
            id,
            currentUser,
        );

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        const amounts: { [index: string]: { amount: number, isFoil: boolean } } = {};

        if (
            Array.isArray(cardIDValues) &&
            Array.isArray(amountValues)) {
            let index = 0;
            for (const cardID of cardIDValues) {

                const currentAmount = Number.parseInt(amountValues[index]);
                const isFoil = (Array.isArray(isFoilValues) ? isFoilValues[index] === 'on' : false);

                if (!Number.isNaN(currentAmount)) {
                    amounts[cardID] = {
                        amount: currentAmount,
                        isFoil: isFoil,
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
                .getRepository(CardToLibraryEntity)
                .createQueryBuilder('c2l')
                .innerJoinAndSelect('c2l.card', 'c2l__c')
                .innerJoinAndSelect('c2l.library', 'c2l__l')
                .where('c2l__c.id = :cardId')
                .andWhere('c2l__l.id = :libraryId')
                .andWhere('c2l.is_foil = :isFoil')
                .setParameters({
                    cardId: card.id,
                    libraryId: library.id,
                    isFoil: amounts[key].isFoil,
                })
                .getOne();

            if (association instanceof CardToLibraryEntity) {
                association.amount += amounts[key].amount;
            } else {
                association = new CardToLibraryEntity();
                association.card = card;
                association.library = library;
                association.amount = amounts[key].amount;
                association.isFoil = amounts[key].isFoil;
            }

            await this.connection.manager.save(association);
        }

        return `/libraries/${library.id}`;
    }

    /**
     * Rendere a form for editing a library
     */
    @Get(`/:id(${getUUIDRegEx()})/edit`)
    @Authorized()
    public async getLibraryEditDetailForm(
        @Param('id') id: uuid,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const library = await this.libraryProvider.getLibrary(id, currentUser);

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(
            React.createElement(
                LibraryEditPage,
                {
                    library,
                    currentUser,
                },
            ),
        );
    }

    /**
     * Update a existing deck
     */
    @Post(`/:id(${getUUIDRegEx()})`)
    @Authorized()
    public async updateDeck(
        @Param('id') id: uuid,
        @FormField('name') name: string,
        @FormField('isPublic') isPublic: string,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @Res() response: Response,
    ) {
        const library = await this.libraryProvider.getLibrary(id, currentUser);

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        library.name = name;
        library.isPublic = isPublic === 'on';

        const validationErrors = await validate(library);

        if (validationErrors.length > 0) {
            return react.renderToStaticMarkup(
                React.createElement(
                    LibraryEditPage,
                    {
                        library,
                        currentUser,
                        validationErrors,
                    },
                ),
            );
        }

        await this.connection.manager.save(library);

        response.status(303);
        response.header('Location', `/libraries/${library.id}`);
        return;
    }

    /**
     * Preview adding cards to a deck
     */
    @Get(`/:id(${getUUIDRegEx()})/cards/add`)
    @Authorized()
    public async previewAddCardsToLibrary(
        @Param('id') id: uuid,
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
    ) {
        const library = await this.libraryProvider.getLibrary(id, currentUser);

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(
            React.createElement(
                LibraryAddCardsPage,
                {
                    library,
                    currentUser,
                },
            ),
        );
    }

    /**
     * Rendere a form for creating a deck
     */
    @Get('/add')
    @Authorized()
    public async addLibraryForm(
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
    ) {
        return react.renderToStaticMarkup(
            React.createElement(
                LibraryEditPage,
                {
                    currentUser,
                },
            ),
        );
    }
}
