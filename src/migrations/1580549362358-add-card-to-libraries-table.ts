/*!
 * @copyright Card Librarian Team 2020
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Create the card_to_libraries table
 */
export class AddCardToLibraryEntity1580549362358 implements MigrationInterface {
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
            name: 'card_to_libraries',
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
                    name: 'card_id',
                    type: 'integer',
                },
                {
                    name: 'library_id',
                    type: 'integer',
                },
                {
                    name: 'amount',
                    type: 'integer',
                },
            ],
        });

        await queryRunner.createTable(table);
    }

    // tslint:disable-next-line:completed-docs
    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('card_to_libraries');
    }

}
