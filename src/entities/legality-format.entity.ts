/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { IsString, MinLength } from 'class-validator';
import { Column, OneToMany } from 'typeorm';

import { LegalityEntity } from './legality.entity';


/**
 * Defines a type of legality
 */
@OwnableEntity('card_management.legality_formats')
export class LegalityFormatEntity extends BaseEntity {
    @Column()
    @IsString()
    @MinLength(1)
    public code!: string;

    @Column()
    @IsString()
    @MinLength(1)
    public name!: string;

    @OneToMany(
        () => LegalityEntity,
        (entity) => entity.legalityFormat,
    )
    public legalities!: LegalityEntity[];
}
