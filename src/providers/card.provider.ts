/*!
 * @copyright Card Librarian Team 2020
 */


import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { CardEntity } from '../entities/card.entity';
import { CardAssignment } from '../models/card-assignment.model';

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
        const cards = await this
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

        return cards.map(item => {
            return new CardAssignment(item);
        });
    }

    /**
     * Get a extact card with its set code and set number
     */
    public async exactMatch(text: string) {
        const results = text.split(':');

        if (!(results.length >= 2 && results.length <= 4)) {
            return [];
        }

        const setCode = results[0].slice(1).toUpperCase();
        const setNumber = results[1];
        const amount = Number.parseInt(results[2]);
        const isFoil = results[3] === 't';

        const cards = await this
            .connection
            .getRepository(CardEntity)
            .createQueryBuilder('c')
            .innerJoinAndSelect('c.set', 'c__s')
            .where('c.set_number = :setNumber', { setNumber })
            .andWhere('c__s.code = :setCode', { setCode })
            .getMany();

        return cards.map(item => {
            const card = new CardAssignment(item);
            card.amount = (!Number.isNaN(amount) ? amount : undefined);
            card.isFoil = isFoil;

            return card;
        });
    }

    /**
     * Resolve a string into a number of cards
     */
    public async resolveCards(data: string) {
        const lines = data.split(/\r?\n/);

        const cards: CardAssignment[] = [];

        for (let line of lines) {
            line = line.trim();

            if (line.length === 0) {
                continue;
            }

            if (line.startsWith('#')) {
                cards.push(
                    ...(await this.exactMatch(line)),
                );
            } else {
                cards.push(
                    ...(await this.fuzzyMatch(line)),
                );
            }
        }

        return cards;
    }
}
