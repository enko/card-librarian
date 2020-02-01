/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { IsString } from 'class-validator';
import { Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CardToLibraryEntity } from './card-to-library.entity';
import { SetEntity } from './set.entity';

/**
 * Card Entity
 */
@OwnableEntity('card_management.cards')
export class CardEntity extends BaseEntity {
    @Column()
    @IsString()
    public name!: string;

    @Column()
    public colors?: string;

    @Column({
        name: 'mana_cost',
    })
    public manaCost?: string;

    @Column()
    public types!: string;

    @ManyToOne(
        () => SetEntity,
    )
    @JoinColumn({
        name: 'set_id',
    })
    public set!: SetEntity;

    @OneToMany(
        () => CardToLibraryEntity,
        (ca) => ca.card,
    )
    public cardAssociations?: CardToLibraryEntity[];

    @Column({
        name: 'import_data',
    })
    public importData!: string;
}
