/*!
 * @copyright Card Librarian Team 2020
 */

import { TokenEntity, UserEntity, UserManagementMetadata } from '@flyacts/backend-user-management';
import {
    Action,
    InternalServerError,
} from '@flyacts/routing-controllers';
import { Connection } from 'typeorm';

/**
 * Create a current user checker for routing controllers
 *
 * @param connection a typeorm connection
 */
export function createCurrentUserChecker(
    connection: Connection,
) {
    return async (action: Action) => {
        const token = action.request.cookies['authorization'];

        if (typeof token !== 'string') {
            return undefined;
        }

        const tokenEntity = await connection.manager.findOne(TokenEntity, {
            where: {
                token: token,
            },
        });

        if (!(tokenEntity instanceof TokenEntity)) {
            return undefined;
        }

        const user = await connection.manager.findOne(UserEntity, tokenEntity.user.id);

        if (!(user instanceof UserEntity)) {
            throw new InternalServerError();
        }

        const userClass = UserManagementMetadata.instance.userClass;

        if (userClass === UserEntity) {
            return user;
        }

        return connection.manager.findOne(userClass, {
            where: {
                user,
            },
        });

    };
}
