/*!
 * @copyright Card Librarian Team 2020
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

// tslint:disable:completed-docs

/**
 * The initial migrations
 */
export class Init1598708963537 implements MigrationInterface {
    public async up(queryRunner: QueryRunner) {
        const baseEntitySchema: TableColumnOptions[] = [
            {
                name: 'id',
                isPrimary: true,
                type: 'uuid',
                isGenerated: true,
                generationStrategy: 'uuid',
            },
            {
                name: 'created_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updated_at',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
        ];

        const userExtension = new Table({
            name: 'user_extensions',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'firstname',
                    type: 'text',
                },
                {
                    name: 'lastname',
                    type: 'text',
                },
                {
                    name: 'users_id',
                    type: 'uuid',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk__user_extensions',
                    columnNames: ['users_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                },
            ],
        });

        await queryRunner.createTable(userExtension, true);
    }

    // tslint:disable-next-line:no-empty
    public async down() { }
}
