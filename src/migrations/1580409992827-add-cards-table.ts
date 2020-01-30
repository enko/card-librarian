/*!
 * @copyright FLYACTS GmbH 2020
 */

import {MigrationInterface, QueryRunner, Table} from 'typeorm';
import { TableColumnOptions } from 'typeorm/schema-builder/options/TableColumnOptions';

/**
 * Create the cards table
 */
export class AddCardEntity1580409992827 implements MigrationInterface {
    // tslint:disable-next-line:completed-docs
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('CREATE SCHEMA card_management');

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

            name: 'card_management.cards',
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
                },
                {
                    name: 'colors',
                    type: 'text',
                },
                {
                    name: 'mana_cost',
                    type: 'text',
                    isNullable: true,
                },
                {
                    name: 'import_data',
                    type: 'jsonb',
                }
            ],
        });

        await queryRunner.createTable(table);
    }

    // tslint:disable-next-line:completed-docs
    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('cards');
    }

}
