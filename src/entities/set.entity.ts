/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { Column, OneToMany } from 'typeorm';

import { CardEntity } from './card.entity';

/**
 * Set Entity
 */
@OwnableEntity('card_management.sets')
export class SetEntity extends BaseEntity {
    @Column()
    public code?: string;

    @Column()
    public name!: string;

    @Column({
        name: 'import_data',
    })
    public importData!: string;

    @OneToMany(
        () => CardEntity,
        (card) => card.set,
    )
    public cards?: CardEntity[];
}
