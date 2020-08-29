/*!
 * @copyright Card Librarian Team 2020
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Create the card_to_libraries table
 */
export class AddCardToLibraryEntity1598708963582 implements MigrationInterface {
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
            name: 'card_to_libraries',
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
                    name: 'card_id',
                    type: 'uuid',
                },
                {
                    name: 'library_id',
                    type: 'uuid',
                },
                {
                    name: 'amount',
                    type: 'integer',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk___card_to_libraries___card_id___cards',
                    columnNames: ['card_id'],
                    referencedTableName: 'card_management.cards',
                    referencedColumnNames: ['id'],
                },
                {
                    name: 'fk___card_to_libraries___library_id___libraries',
                    columnNames: ['library_id'],
                    referencedTableName: 'card_management.libraries',
                    referencedColumnNames: ['id'],
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
