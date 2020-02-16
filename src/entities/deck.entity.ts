/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { IsBoolean, IsString, MinLength } from 'class-validator';
import { Column, OneToMany } from 'typeorm';

import { CardToLibraryEntity } from './card-to-library.entity';

/**
 * Library Entity
 */
@OwnableEntity('deck_management.decks')
export class DeckEntity extends BaseEntity {
    @Column()
    @IsString()
    @MinLength(1)
    public name!: string;

    @Column({
        name: 'is_public',
    })
    @IsBoolean()
    public isPublic: boolean = false;

    @OneToMany(
        () => CardToLibraryEntity,
        (ca) => ca.library,
    )
    public cardAssociations?: CardToLibraryEntity[];
}
