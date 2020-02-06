/*!
 * @copyright Card Librarian Team 2020
 */

import {MigrationInterface, QueryRunner} from 'typeorm';

/**
 * Rename primary keys to conform to a common scheme
 */
export class ApplyNamingSchemeToPrimaryKeys1581013965952 implements MigrationInterface {
    /**
     * UP
     */
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query('ALTER TABLE card_management.card_to_libraries DROP CONSTRAINT IF EXISTS "PK_101f9443db0ee7649ad86e6c2c9" CASCADE');
        await queryRunner.query('ALTER TABLE card_management.libraries DROP CONSTRAINT IF EXISTS "PK_6e87e817f9e4c481eb8a5e1345e" CASCADE');
        await queryRunner.query('ALTER TABLE card_management.cards DROP CONSTRAINT IF EXISTS "PK_0f6c7cb5d5e69da6df59da9f22b" CASCADE');
        await queryRunner.query('ALTER TABLE card_management.sets DROP CONSTRAINT IF EXISTS "PK_4732bda5d3be28b2be71a8618f5" CASCADE');
        await queryRunner.query('ALTER TABLE public.user_extensions DROP CONSTRAINT IF EXISTS "PK_c092aa251d17d6bc0c7d18b632d" CASCADE');
        await queryRunner.query('ALTER TABLE public.tokens DROP CONSTRAINT IF EXISTS "PK_3001e89ada36263dabf1fb6210a" CASCADE');
        await queryRunner.query('ALTER TABLE public.roles DROP CONSTRAINT IF EXISTS "PK_c1433d71a4838793a49dcad46ab" CASCADE');
        await queryRunner.query('ALTER TABLE public.users DROP CONSTRAINT IF EXISTS "PK_a3ffb1c0c8416b9fc6f907b7433" CASCADE');
        await queryRunner.query('ALTER TABLE public.migrations DROP CONSTRAINT IF EXISTS "PK_8c82d7f526340ab734260ea46be" CASCADE');
        await queryRunner.query('ALTER TABLE public.migrations ADD CONSTRAINT pk___migrations___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE public.users ADD CONSTRAINT pk___users___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE public.roles ADD CONSTRAINT pk___roles___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE public.tokens ADD CONSTRAINT pk___tokens___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE public.user_extensions ADD CONSTRAINT pk___user_extensions___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE card_management.sets ADD CONSTRAINT pk___sets___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE card_management.cards ADD CONSTRAINT pk___cards___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE card_management.libraries ADD CONSTRAINT pk___libraries___id PRIMARY KEY (id)');
        await queryRunner.query('ALTER TABLE card_management.card_to_libraries ADD CONSTRAINT pk___card_to_libraries___id PRIMARY KEY (id)');
    }

    /**
     * Down
     */
    public async down(_queryRunner: QueryRunner) {
        throw new Error('Not Supported');
    }

}
