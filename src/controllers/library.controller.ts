/*!
 * @copyright FLYACTS GmbH 2018
 */

import {
    Get,
    Controller,
    Post,
    FormField,
    Redirect,
    Param,
    NotFoundError,
} from '@flyacts/routing-controllers';
import { Service } from 'typedi';
import * as react from 'react-dom/server';
import { LibraryOverviewPage } from '../templates/pages/libary-overview.page';
import React = require('react');
import { Connection } from 'typeorm';
import { LibraryEntity } from '../entities/library.entity';
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
            }
        ),
        );
    }

    @Post()
    @Redirect('/libraries')
    public async save(
        @FormField('name') name: string,
    ) {
        const library = new LibraryEntity();

        library.name = name;

        await this.connection.manager.save(library);
    }

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

        if(!(library instanceof LibraryEntity)) {
            throw new NotFoundError();
        }

        return react.renderToStaticMarkup(React.createElement(LibraryDetailPage, { library }))
    }
}
