/*!
 * @copyright Card Librarian Team 2020
 */

import { createCurrentUserChecker } from '@flyacts/backend-user-management';
import { ExpressErrorMiddlewareInterface, InternalServerError, Middleware, NotFoundError } from '@flyacts/routing-controllers';
import { Request, Response } from 'express';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { UserExtensionEntity } from '../entities/user-extension.entity';
import NotFoundPage from '../templates/pages/not-found.page';

/**
 * Handle not found errors and show a error page
 */
@Middleware({ type: 'after' })
@Service()
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    public constructor(
        private connection: Connection,
    ) {}

    /**
     * Handle the error my own way
     */
    public async error(
        error: Error,
        request: Request,
        response: Response,
        next: (err: Error) => unknown,
    ) {
        const checker = createCurrentUserChecker(this.connection);
        const currentUser = await checker({
            request,
            response,
        });

        if (!((currentUser instanceof UserExtensionEntity) || (typeof currentUser === 'undefined'))) {
            throw new InternalServerError();
        }

        if (error instanceof NotFoundError) {
            response.send(react.renderToStaticMarkup(
                React.createElement(NotFoundPage, { currentUser }),
            ));
        }
        next(error);
    }

}
