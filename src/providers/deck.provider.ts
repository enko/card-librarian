/*!
 * @copyright Card Librarian Team 2020
 */

import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { CardToDeckEntity } from '../entities/card-to-deck.entity';
import { DeckEntity } from '../entities/deck.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';
import { CardToDeckType } from '../enums/card-to-deck-type.enum';

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
            .leftJoinAndSelect('d__ca.card', 'd__ca__c')
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

    /**
     * Fetch a specific assignment
     */
    public async getCardAssignment(
        deckId: number,
        cardAssignmentId: number,
        currentUser: UserExtensionEntity,
    ) {
        return this
            .connection
            .getRepository(CardToDeckEntity)
            .createQueryBuilder('c2d')
            .innerJoinAndSelect('c2d.deck', 'c2d__d')
            .innerJoinAndSelect('c2d.card', 'c2d__c')
            .innerJoinAndSelect('c2d__c.set', 'c2d__c__s')
            .where('c2d.id = :cardAssignmentId', {
                cardAssignmentId,
            })
            .andWhere('c2d__d.id = :deckId', { deckId })
            .andWhere('c2d.created_by = :userId', { userId: currentUser.id })
            .getOne();
    }

    /**
     * Fetch a specific assignment
     */
    public async getCardAssignmentByCardAndType(
        deckId: number,
        cardId: number,
        type: CardToDeckType,
    ) {
        return this
            .connection
            .getRepository(CardToDeckEntity)
            .createQueryBuilder('c2d')
            .innerJoinAndSelect('c2d.deck', 'c2d__d')
            .innerJoinAndSelect('c2d.card', 'c2d__c')
            .innerJoinAndSelect('c2d__c.set', 'c2d__c__s')
            .where('c2d.type = :type', {
                type,
            })
            .andWhere('c2d__c.id = :cardId', { cardId })
            .andWhere('c2d__d.id = :deckId', { deckId })
            .getOne();
    }
}
