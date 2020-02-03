/*!
 * @copyright Card Librarian Team 2020
 */

import { TokenEntity } from '@flyacts/backend-user-management';
import {
    Controller,
    CookieParam,
    CurrentUser,
    FormField,
    Get,
    Post,
    Redirect,
    Res,
} from '@flyacts/routing-controllers';
import { Response } from 'express';
import moment from 'moment';
import React = require('react');
import * as react from 'react-dom/server';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { UserExtensionEntity } from '../entities/user-extension.entity';
import UserLoginPage from '../templates/pages/user-login.page';

const uidgen = new (require('uid-generator'))(256);

/**
 * A controller for user related stuff
 */
@Service()
@Controller('/users')
export class UserController {

    public constructor(
        private connection: Connection,
    ) { }

    /**
     * Present the login page
     */
    @Get('/login')
    public async getLoginPage() {
        return react.renderToStaticMarkup(React.createElement(UserLoginPage));
    }

    /**
     * Handle the login
     */
    @Post('/login')
    public async handleLogin(
        @FormField('username') username: string,
        @FormField('password') password: string,
        @Res() response: Response,
    ) {
        const user = await this
            .connection
            .getRepository(UserExtensionEntity)
            .createQueryBuilder('ue')
            .innerJoinAndSelect('ue.user', 'ue__u')
            .where('ue__u.username = :username', { username })
            .getOne();

        if (!(user instanceof UserExtensionEntity)) {
            return react.renderToStaticMarkup(React.createElement(UserLoginPage, {
                errors: 'Benutzer unbekannt',
                username,
                password,
            }));
        }

        if (!(await user.user.verifyPassword(password))) {
            return react.renderToStaticMarkup(React.createElement(UserLoginPage, {
                errors: 'Password Falsch',
                username,
                password,
            }));
        }

        const token = new TokenEntity();

        token.user = user.user;
        token.token = await uidgen.generate();
        token.scopes = ['authorization'];

        await this.connection.manager.save(token);

        response.cookie(
            'authorization',
            token.token,
            {
                expires: moment().add(30, 'days').toDate(),
            },
        );
        response.set('Location', '/');
        response.statusCode = 303;
        return response.send('');
    }

    /**
     * Logout the user
     */
    @Get('/logout')
    @Redirect('/')
    public async logout(
        @CurrentUser({ required: true }) currentUser: UserExtensionEntity,
        @CookieParam('authorization') authorization: string,
        @Res() response: Response,
    ) {
        const token = await this
            .connection
            .getRepository(TokenEntity)
            .createQueryBuilder('t')
            .where('t.user_id = :userId and token = :token', {
                userId: currentUser.user.id,
                token: authorization,
            })
            .getOne();

        if (!(token instanceof TokenEntity)) {
            return;
        }

        await this.connection.manager.remove(token);

        response.cookie('authorization', '', {
            expires: moment().subtract(1, 'day').toDate(),
        });
    }
}
