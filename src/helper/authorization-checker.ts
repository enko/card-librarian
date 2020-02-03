/*!
 * @copyright Card Librarian Team 2020
 */

import { TokenEntity } from '@flyacts/backend-user-management';
import { Action } from '@flyacts/routing-controllers';
import { Request } from 'express';
import { Connection } from 'typeorm';


/**
 * Create a authorization checker for routing controllers
 *
 * @param connection a typeorm connection
 */
export function createAuthorizationCheck(connection: Connection) {
    return async (action: Action, roles: string[]) => {
        const request: Request = action.request;
        const token = request.cookies['authorization'];

        if (typeof token !== 'string') {
            return false;
        }

        const tokenTentity = await connection.manager.findOne(TokenEntity, {
            where: {
                token: token,
            },
        });

        if (!(tokenTentity instanceof TokenEntity)) {
            return false;
        }

        if (roles.length > 0) {
            const hasRole = roles
                .filter(role => !role.startsWith('@SCOPE'))
                .map(role =>
                    tokenTentity
                        .user
                        .roles
                        .map(_role => _role.name)
                        .includes(role),
                )
                .filter(item => item === true)
                .length > 0;

            const hasScope = roles
                .filter(scope => scope.startsWith('@SCOPE'))
                .map(scope =>
                    tokenTentity
                        .scopes
                        .map(_scope => `@SCOPE/${_scope}`)
                        .includes(scope),
                )
                .filter(item => item === true)
                .length > 0;

            return hasRole || hasScope;
        }

        return true;
    };
}
