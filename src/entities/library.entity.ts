/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { IsString, MinLength } from 'class-validator';
import { Column, OneToMany } from 'typeorm';

import { CardToLibraryEntity } from './card-to-library.entity';

/**
 * Library Entity
 */
@OwnableEntity('card_management.libraries')
export class LibraryEntity extends BaseEntity {
    @Column()
    @IsString()
    @MinLength(1)
    public name!: string;

    @OneToMany(
        () => CardToLibraryEntity,
        (ca) => ca.library,
    )
    public cardAssociations?: CardToLibraryEntity[];
}
