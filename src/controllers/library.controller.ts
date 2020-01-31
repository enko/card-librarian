/*!
 * @copyright Card Librarian Team 2020
 */

import {
    Controller,
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

import { LibraryEntity } from '../entities/library.entity';
import { LibraryOverviewPage } from '../templates/pages/libary-overview.page';
import { LibraryDetailPage } from '../templates/pages/library-detail.page';


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
    public async root() {
        const libraries = await this
            .connection
            .getRepository(LibraryEntity)
            .createQueryBuilder('l')
            .getMany();

        return react.renderToStaticMarkup(React.createElement(
            LibraryOverviewPage,
            {
                libraries,
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
    ) {
        const library = await this
            .connection
            .getRepository(LibraryEntity)
            .createQueryBuilder('l')
            .where('l.id = :id', { id })
            .getOne();

        if (!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(React.createElement(LibraryDetailPage, { library }));
    }
}
