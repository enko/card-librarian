/*!
 * @copyright Card Librarian Team 2020
 */

import { RoleEntity } from '@flyacts/backend-user-management';
import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable:completed-docs

/**
 * Democontent from migrations
 */
export class InitialContent1598708963546 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        const roles = [
            'admin',
            'user',
        ];

        for (const role of roles) {
            const roleEntity = new RoleEntity();
            roleEntity.name = role;
            await queryRunner.connection.manager.save(roleEntity);
        }
    }

    // tslint:disable-next-line:no-empty
    public async down() { }
}
