/*!
 * @copyright Card Librarian Team 2020
 */


import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { CardEntity } from '../entities/card.entity';

/**
 * Provides card specific functionality
 */
@Service()
export class CardProvider {
    public constructor(
        private connection: Connection,
    ) { }

    /**
     * Fuzzy match a card and its translations
     */
    public async fuzzyMatch(text: string) {
        return this
            .connection
            .getRepository(CardEntity)
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.set', 'c__s')
            .leftJoinAndSelect('c.translations', 'c__t')
            .where('c.name ILIKE :name', { name: `%${text}%` })
            .orWhere('c__t.name ILIKE :translatedName', {
                translatedName: `%${text}%`,
            })
            .getMany();
    }

    /**
     * Get a extact card with its set code and set number
     */
    public async exactMatch(text: string) {
        const results = text.split(':');

        if (results.length !== 2) {
            return [];
        }

        const setCode = results[0].slice(1).toUpperCase();
        const setNumber = results[1];

        return this
            .connection
            .getRepository(CardEntity)
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.set', 'c__s')
            .where('c.set_number = :setNumber', { setNumber })
            .andWhere('c__s.code = :setCode', { setCode })
            .getMany();
    }
}
