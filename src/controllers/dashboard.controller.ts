/*!
 * @copyright Card Librarian Team 2020
 */

import { Controller, CurrentUser, Get } from '@flyacts/routing-controllers';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';

import { UserExtensionEntity } from '../entities/user-extension.entity';
import DashboardPage from '../templates/pages/dashboard.page';

/**
 * Create a dashboard controller
 */
@Service()
@Controller('/')
export class DashboardController {
    /**
     * Get the main page
     */
    @Get()
    public async get(
        @CurrentUser() currentUser?: UserExtensionEntity,
    ) {
        return react.renderToStaticMarkup(
            React.createElement(DashboardPage, { currentUser }),
        );
    }
}
