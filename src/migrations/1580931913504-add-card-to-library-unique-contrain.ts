/*!
 * @copyright Card Librarian Team 2020
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Add a unique contrain for CardToLibrary
 */
export class AddCardToLibraryUniqueContrain1580931913504 implements MigrationInterface {

    /**
     * TypeORMs up
     */
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(
            'ALTER TABLE public.card_to_libraries ADD CONSTRAINT uq___card_to_libaries___card_id___library_id UNIQUE (card_id,library_id)',
        );
        await queryRunner.query('ALTER TABLE card_to_libraries SET SCHEMA card_management');
    }

    /**
     * TypeORMs down
     */
    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(
            'ALTER TABLE public.card_to_libraries DROP CONSTRAINT uq___card_to_libaries___card_id___library_id',
        );
        await queryRunner.query(
            'ALTER TABLE card_management.card_to_libraries SET SCHEMA public',
        );
    }

}
