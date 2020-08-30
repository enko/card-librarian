/*!
 * @copyright Card Librarian Team 2020
 */

import { uuid } from '@flyacts/backend-core-entities';
import { Service } from 'typedi';
import { Connection } from 'typeorm';

import { LibraryEntity } from '../entities/library.entity';
import { UserExtensionEntity } from '../entities/user-extension.entity';

/**
 * Functions for libraries
 */
@Service()
export class LibraryProvider {
    public constructor(
        private connection: Connection,
    ) { }

    /**
     * Return all the decks
     */
    public async getLibraries(
        currentUser?: UserExtensionEntity,
    ) {
        const query = this
            .connection
            .getRepository(LibraryEntity)
            .createQueryBuilder('l')
            .where('l.is_public = true');

        if (currentUser instanceof UserExtensionEntity) {
            query.orWhere('(l.is_public = false AND l.created_by = :userId)', {
                userId: currentUser.id,
            });
        }

        return query.getMany();
    }

    /**
     * Return all the decks
     */
    public async getLibrary(
        libraryId: uuid,
        currentUser?: UserExtensionEntity,
    ) {
        const query = this
            .connection
            .getRepository(LibraryEntity)
            .createQueryBuilder('l')
            .leftJoinAndSelect('l.cardAssociations', 'l__ca')
            .leftJoinAndSelect('l__ca.card', 'l__ca__c')
            .leftJoinAndSelect('l__ca__c.set', 'l__ca__c__s')
            .orderBy('l__ca__c__s.name', 'ASC')
            .addOrderBy('l__ca__c.set_number', 'ASC')
            .where('l.id = :libraryId')
            .andWhere('l.is_public = true');

        if (currentUser instanceof UserExtensionEntity) {
            query.orWhere('(l.id = :libraryId AND l.is_public = false AND l.created_by = :userId)', {
                userId: currentUser.id,
            });
        }

        query.setParameter('libraryId', libraryId);

        return query.getOne();
    }
}
