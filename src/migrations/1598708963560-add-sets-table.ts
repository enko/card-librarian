/*!
 * @copyright Card Librarian Team 2020
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Create the sets table
 */
export class AddSetEntity1598708963560 implements MigrationInterface {
    // tslint:disable-next-line:completed-docs
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

        const table = new Table({
            name: 'card_management.sets',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'created_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'updated_by',
                    type: 'uuid',
                    isNullable: true,
                },
                {
                    name: 'code',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'name',
                    type: 'text',
                },
                {
                    name: 'import_data',
                    type: 'jsonb',
                },
            ],
        });

        await queryRunner.createTable(table);
    }

    // tslint:disable-next-line:completed-docs
    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('sets');
    }

}
