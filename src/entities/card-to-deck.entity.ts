/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { CardEntity } from './card.entity';
import { DeckEntity } from './deck.entity';

/**
 * CardToLibrary Entity
 */
@OwnableEntity('deck_management.cards_to_decks')
export class CardToDeckEntity extends BaseEntity {
    @ManyToOne(
        () => CardEntity,
    )
    @JoinColumn({
        name: 'card_id',
    })
    public card!: CardEntity;

    @ManyToOne(
        () => DeckEntity,
    )
    @JoinColumn({
        name: 'deck_id',
    })
    public deck!: DeckEntity;

    @Column()
    public amount!: number;
}
