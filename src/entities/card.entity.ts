/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { IsString } from 'class-validator';
import { Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CardToDeckEntity } from './card-to-deck.entity';
import { CardToLibraryEntity } from './card-to-library.entity';
import { ForeignCardDataEntity } from './foreign-card-data.entity';
import { LegalityEntity } from './legality.entity';
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

    @Column()
    public uuid!: string;

    @Column({
        name: 'set_number',
    })
    public setNumber!: string;


    @Column({
        name: 'converted_mana_cost',
    })
    public convertedManaCost!: number;

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

    @OneToMany(
        () => ForeignCardDataEntity,
        (fcd => fcd.card),
    )
    public translations?: ForeignCardDataEntity[];

    @OneToMany(
        () => LegalityEntity,
        (entity) => entity.card,
    )
    public legalities!: LegalityEntity[];

    @OneToMany(
        () => CardToDeckEntity,
        (entity) => entity.card,
    )
    public deckAssignments!: CardToDeckEntity[];
}
