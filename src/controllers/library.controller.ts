/*!
 * @copyright Card Librarian Team 2020
 */

// tslint:disable:no-duplicate-string

import {
    Controller,
    CurrentUser,
    FormField,
    Get,
    NotFoundError,
    Param,
    Post,
    Redirect,
} from '@flyacts/routing-controllers';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { CardToLibraryEntity } from '../entities/card-to-library.entity';
import { CardEntity } from '../entities/card.entity';
import { LibraryEntity } from '../entities/library.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import LibraryOverviewPage from '../templates/pages/libary-overview.page';
import { LibraryCardAddPreviewPage } from '../templates/pages/library-card-add-preview.page';
import LibraryDetailPage from '../templates/pages/library-detail.page';


/**
 * Controller for /
 */
@Controller('/libraries')
@Service()
export class LibraryController {

    public constructor(
        private connection: Connection,
    ) {

    }

    /**
     * returns certian health statistics
     */
    @Get()
    public async root(
        @CurrentUser() currentUser?: UserExtensionEntity,
    ) {
        const libraries = await this
            .connection
            .getRepository(LibraryEntity)
            .createQueryBuilder('l')
            .getMany();

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
    ) {
        const library = new LibraryEntity();

        library.name = name;

        await this.connection.manager.save(library);
    }

    /**
     * Get a library detail page
     */
    @Get('/:id')
    public async getDetail(
        @Param('id') id: number,
        @CurrentUser() currentUser: UserExtensionEntity,
    ) {
        const library = await this.getLibrary(id);

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
    @Post('/:id/cards/preview')
    public async addCard(
        @Param('id') id: number,
        @FormField('import') importData: string,
    ) {
        const library = await this.getLibrary(id);

        const lines = importData.split(/\r?\n/);

        const cards: CardEntity[] = [];

        for (let line of lines) {
            line = line.trim();

            if (line.length === 0) {
                continue;
            }

            const match = await this
                .connection
                .getRepository(CardEntity)
                .createQueryBuilder('c')
                .innerJoinAndSelect('c.set', 'c__s')
                .leftJoinAndSelect('c.translations', 'c__t')
                .where('c.name ILIKE :name', { name: `%${line}%` })
                .orWhere('c__t.name ILIKE :translatedName', {
                    translatedName: `%${line}%`,
                })
                .getMany();

            cards.push(...match);
        }

        return react.renderToStaticMarkup(React.createElement(LibraryCardAddPreviewPage, {
            cards,
            library,
        }));
    }

    /**
     * Submit cards to your library
     */
    @Post('/:id/cards/submit')
    @Redirect('/libraries')
    public async submitCards(
        @Param('id') id: number,
        @FormField('card_id') cardIDValues?: string[],
        @FormField('amount') amountValues?: string[],
    ) {
        const library = await this.getLibrary(id);

        const amounts: { [index: string]: number } = {};

        if (Array.isArray(cardIDValues) && Array.isArray(amountValues)) {
            let index = 0;
            for (const cardID of cardIDValues) {

                const currentAmount = Number.parseInt(amountValues[index]);

                if (!Number.isNaN(currentAmount)) {
                    amounts[cardID] = currentAmount;
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
            const association = new CardToLibraryEntity();

            association.card = card;
            association.library = library;
            association.amount = amounts[key];

            await this.connection.manager.save(association);
        }

        return `/libraries/${library.id}`;
    }

    /**
     * Fetch a library from the db
     */
    private async getLibrary(id: number) {
        const library = await this
            .connection
            .getRepository(LibraryEntity)
            .createQueryBuilder('l')
            .leftJoinAndSelect('l.cardAssociations', 'l__ca')
            .leftJoinAndSelect('l__ca.card', 'l__ca__c')
            .leftJoinAndSelect('l__ca__c.set', 'l__ca__c__s')
            .where('l.id = :id', { id })
            .getOne();

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        return library;
    }
}
