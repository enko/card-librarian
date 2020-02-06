/*!
 * @copyright Card Librarian Team 2020
 */


import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Run migration add_foreign_keys
 */
export class AddForeignKeys1581016043229 implements MigrationInterface {
    /**
     * TypeORMs migration up
     */
    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(
            'ALTER TABLE public.user_roles ADD CONSTRAINT fk__user_roles__users_id FOREIGN KEY (users_id) REFERENCES public.users (id) MATCH SIMPLE ON DELETE NO ACTION ON UPDATE NO ACTION;',
        );
        await queryRunner.query(
            'ALTER TABLE public.user_roles ADD CONSTRAINT fk__user_roles__roles_id FOREIGN KEY (roles_id) REFERENCES public.roles (id) MATCH SIMPLE ON DELETE NO ACTION ON UPDATE NO ACTION;',
        );
        await queryRunner.query(
            'ALTER TABLE public.tokens ADD CONSTRAINT fk__tokens__users_id FOREIGN KEY (users_id) REFERENCES public.users (id) MATCH SIMPLE ON DELETE NO ACTION ON UPDATE NO ACTION;',
        );
        await queryRunner.query(
            'ALTER TABLE public.user_extensions ADD CONSTRAINT fk__user_extensions FOREIGN KEY (users_id) REFERENCES public.users (id) MATCH SIMPLE ON DELETE NO ACTION ON UPDATE NO ACTION;',
        );
        await queryRunner.query(
            'ALTER TABLE card_management.cards ADD CONSTRAINT fk___cards___set_id___sets FOREIGN KEY (set_id) REFERENCES card_management.sets (id) MATCH SIMPLE ON DELETE NO ACTION ON UPDATE NO ACTION;',
        );
        await queryRunner.query(
            'ALTER TABLE card_management.card_to_libraries ADD CONSTRAINT fk___card_to_libraries___card_id___cards FOREIGN KEY (card_id) REFERENCES card_management.cards (id) MATCH SIMPLE ON DELETE NO ACTION ON UPDATE NO ACTION;',
        );
        await queryRunner.query(
            'ALTER TABLE card_management.card_to_libraries ADD CONSTRAINT fk___card_to_libraries___library_id___libraries FOREIGN KEY (library_id) REFERENCES card_management.libraries (id) MATCH SIMPLE ON DELETE NO ACTION ON UPDATE NO ACTION;',
        );

    }

    /**
     * TypeORMs migration down
     */
    public async down(_queryRunner: QueryRunner) {
        throw new Error('Not Possible');
    }

}
