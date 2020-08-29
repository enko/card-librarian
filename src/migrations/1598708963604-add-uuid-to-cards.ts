/*!
 * @copyright Card Librarian Team 2020
 */

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * Run migration add_uuid_to_cards
 */
export class AddUuidToCards1598708963604 implements MigrationInterface {
    /**
     * TypeORMs migration up
     */
    public async up(queryRunner: QueryRunner) {
        const uuidColumn = new TableColumn({
            name: 'uuid',
            type: 'uuid',
            isNullable: true,
        });

        await queryRunner.addColumn('card_management.cards', uuidColumn);

        const cards = await queryRunner.query('select id, import_data->>\'uuid\' as uuid from card_management.cards');

        for (const card of cards) {
            await queryRunner.query('UPDATE card_management.cards SET uuid = $1 WHERE id = $2', [
                card.uuid,
                card.id,
            ]);
        }

        await queryRunner.query('ALTER TABLE card_management.cards ALTER COLUMN uuid SET NOT NULL');
    }

    /**
     * TypeORMs migration down
     */
    public async down(queryRunner: QueryRunner) {
        await queryRunner.dropColumn('card_management.cards', 'uuid');
    }

}
