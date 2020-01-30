/*!
 * @copyright FLYACTS GmbH 2020
 */

import { OwnableEntity } from '@flyacts/backend-user-management';
import { BaseEntity } from '@flyacts/backend-core-entities';
import { Column } from 'typeorm';
import { IsString } from 'class-validator';

/**
 * Card Entity
 */
@OwnableEntity('card_management.cards')
export class CardEntity extends BaseEntity {
    @Column()
    @IsString()
    public name!: string;
    @Column()
    public colors!: string;
    @Column({
        name: 'mana_cost'
    })
    public manaCost?: string;
    @Column({
        name: 'import_data',
    })
    public importData!: string;
}
