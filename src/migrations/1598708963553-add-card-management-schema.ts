/*!
 * @copyright Card Librarian Team 2020
 */

// tslint:disable:completed-docs

import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Create a schema for all card management stuff
 */
export class AddCardManagementSchema1598708963553 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('CREATE SCHEMA card_management');
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query('DROP SCHEMA card_management');
    }

}
