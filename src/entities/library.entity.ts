/*!
 * @copyright FLYACTS GmbH 2020
 */

import { OwnableEntity } from '@flyacts/backend-user-management';
import { BaseEntity } from '@flyacts/backend-core-entities';
import { IsString, MinLength } from 'class-validator';
import { Column } from 'typeorm';

/**
 * Library Entity
 */
@OwnableEntity('card_management.libraries')
export class LibraryEntity extends BaseEntity {
    @Column()
    @IsString()
    @MinLength(1)
    public name!: string;
}
