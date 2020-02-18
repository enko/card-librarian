/*!
 * @copyright Card Librarian Team 2020
 */

import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { DeckEntity } from '../entities/deck.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';

/**
 * Functions for decks
 */
@Service()
export class DeckProvider {
    public constructor(
        private connection: Connection,
    ) { }

    /**
     * Return all the decks
     */
    public async getDecks(
        currentUser?: UserExtensionEntity,
    ) {
        const query = this
            .connection
            .getRepository(DeckEntity)
            .createQueryBuilder('d')
            .where('d.is_public = true');

        if (currentUser instanceof UserExtensionEntity) {
            query.orWhere('(d.is_public = false AND d.created_by = :userId)', {
                userId: currentUser.id,
            });
        }

        return query.getMany();
    }

    /**
     * Return all the decks
     */
    public async getDeck(
        deckId: number,
        currentUser?: UserExtensionEntity,
    ) {
        const query = this
            .connection
            .getRepository(DeckEntity)
            .createQueryBuilder('d')
            .leftJoinAndSelect('d.cardAssociations', 'd__ca')
            .where('d.id = :deckId')
            .andWhere('d.is_public = true');

        if (currentUser instanceof UserExtensionEntity) {
            query.orWhere('(d.id = :deckId AND d.is_public = false AND d.created_by = :userId)', {
                userId: currentUser.id,
            });
        }

        query.setParameter('deckId', deckId);

        return query.getOne();
    }
}
