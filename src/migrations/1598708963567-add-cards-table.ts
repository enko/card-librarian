/*!
 * @copyright Card Librarian Team 2020
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
// tslint:disable-next-line
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Create the cards table
 */
export class AddCardEntity1598708963567 implements MigrationInterface {
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

            name: 'card_management.cards',
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
                    name: 'name',
                    type: 'text',
                },
                {
                    name: 'colors',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'mana_cost',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'import_data',
                    type: 'jsonb',
                },
                {
                    name: 'set_id',
                    type: 'uuid',
                },
                {
                    name: 'types',
                    type: 'text',
                },
            ],
            foreignKeys: [
                {
                    name: 'fk___cards___set_id___sets',
                    columnNames: ['set_id'],
                    referencedTableName: 'card_management.sets',
                    referencedColumnNames: ['id'],
                },
            ],
        });

        await queryRunner.createTable(table);
    }

    // tslint:disable-next-line:completed-docs
    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('cards');
    }

}
