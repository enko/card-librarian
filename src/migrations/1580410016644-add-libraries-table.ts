/*!
 * @copyright FLYACTS GmbH 2020
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Create the libraries table
 */
export class AddLibraryEntity1580410016644 implements MigrationInterface {
    // tslint:disable-next-line:completed-docs
    public async up(queryRunner: QueryRunner) {
        const baseEntitySchema: TableColumnOptions[] = [
            {
                name: 'id',
                isPrimary: true,
                type: 'integer',
                isGenerated: true,
                generationStrategy: 'increment',
            },
            {
                name: 'createdAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updatedAt',
                type: 'timestamp',
                default: 'CURRENT_TIMESTAMP',
            },
        ];

        const table = new Table({
            name: 'card_management.libraries',
            columns: [
                ...baseEntitySchema,
                {
                    name: 'created_by',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'updated_by',
                    type: 'integer',
                    isNullable: true,
                },
                {
                    name: 'name',
                    type: 'text',
                    isNullable: false,
                },
            ],
        });

        await queryRunner.createTable(table);
    }

    // tslint:disable-next-line:completed-docs
    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('libraries');
    }

}
