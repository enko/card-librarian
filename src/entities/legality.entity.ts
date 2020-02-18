/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { IsEnum } from 'class-validator';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { LegalityStatus } from '../enums/legality-status.enum';

import { CardEntity } from './card.entity';
import { LegalityFormatEntity } from './legality-format.entity';

/**
 * Indicates if a card is legal for a specific format
 */
@OwnableEntity('card_management.legalities')
export class LegalityEntity extends BaseEntity {
    @Column()
    @IsEnum(LegalityStatus)
    public status!: LegalityStatus;

    @ManyToOne(
        () => CardEntity,
    )
    @JoinColumn({ name: 'card_id' })
    public card!: CardEntity;

    @ManyToOne(
        () => LegalityFormatEntity,
    )
    @JoinColumn({ name: 'legality_format_id' })
    public legalityFormat!: LegalityFormatEntity;

}
