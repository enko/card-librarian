/*!
 * @copyright Card Librarian Team 2020
 */

import { IsBoolean, IsInstance, IsInt, IsOptional } from 'class-validator';

import { CardEntity } from '../entities/card.entity';

/**
 * Represent a card when adding it to a deck or library
 */
export class CardAssignment {
    @IsInstance(CardEntity)
    public card: CardEntity;

    @IsInt()
    @IsOptional()
    public amount?: number;

    @IsBoolean()
    @IsOptional()
    public isFoil?: boolean;

    public constructor(card: CardEntity) {
        this.card = card;
    }
}
