/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { IsEnum, IsInstance, IsInt } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { CardToDeckType } from '../enums/card-to-deck-type.enum';

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
    @IsInstance(CardEntity)
    public card!: CardEntity;

    @ManyToOne(
        () => DeckEntity,
    )
    @JoinColumn({
        name: 'deck_id',
    })
    @IsInstance(DeckEntity)
    public deck!: DeckEntity;

    @Column()
    @IsInt()
    public amount!: number;

    @Column()
    @IsEnum(CardToDeckType)
    public type!: CardToDeckType;
}
