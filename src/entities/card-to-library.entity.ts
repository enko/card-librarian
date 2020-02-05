/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { CardEntity } from './card.entity';
import { LibraryEntity } from './library.entity';

/**
 * CardToLibrary Entity
 */
@OwnableEntity('card_management.card_to_libraries')
export class CardToLibraryEntity extends BaseEntity {
    @ManyToOne(
        () => CardEntity,
    )
    @JoinColumn({
        name: 'card_id',
    })
    public card!: CardEntity;

    @ManyToOne(
        () => LibraryEntity,
    )
    @JoinColumn({
        name: 'library_id',
    })
    public library!: LibraryEntity;

    @Column()
    public amount!: number;
}
