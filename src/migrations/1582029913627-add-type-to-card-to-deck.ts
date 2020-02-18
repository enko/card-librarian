/*!
 * @copyright Card Librarian Team 2020
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Run migration add_type_to_card_to_decks
 */
export class AddTypeToCardToDeck1582029913627 implements MigrationInterface {
    /**
     * TypeORMs migration up
     */
    public async up(queryRunner: QueryRunner) {
        const query = await fs.readFile(path.resolve(__dirname, `${__filename.slice(0, __filename.length - 3)}.sql`), 'utf-8');
        await queryRunner.query(query);
    }

    /**
     * TypeORMs migration down
     */
    public async down(_queryRunner: QueryRunner) {
        throw new Error('Not Possible');
    }

}
