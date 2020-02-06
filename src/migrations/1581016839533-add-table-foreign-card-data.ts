/*!
 * @copyright Card Librarian Team 2020
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Run migration add_table_foreign_card_data
 */
export class AddTableForeignCardData1581016839533 implements MigrationInterface {
    /**
     * TypeORMs migration up
     */
    public async up(queryRunner: QueryRunner) {
        const query = await fs.readFile(path.resolve(__dirname, '1581016839533-add-table-foreign-card-data.sql'), 'utf-8');
        await queryRunner.query(query);
    }

    /**
     * TypeORMs migration down
     */
    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropTable('card_management.foreign_card_data');
    }

}
