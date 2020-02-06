/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

import { CardEntity } from './card.entity';

/**
 * Contains translations for cards
 */
@OwnableEntity('card_management.foreign_card_data')
export class ForeignCardDataEntity extends BaseEntity {
    @Column({
        name: 'flavor_text',
    })
    public flavorText!: string;
    @Column()
    public language!: string;
    @Column()
    public name!: string;
    @Column()
    public text!: string;
    @Column()
    public type!: string;

    @Column({
        name: 'import_data',
    })
    public importData!: string;

    @ManyToOne(() => CardEntity)
    @JoinColumn({
        name: 'card_id',
    })
    public card!: CardEntity;
}
