/*!
 * @copyright Card Librarian Team 2020
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import { OwnableEntity } from '@flyacts/backend-user-management';
import { Column } from 'typeorm';

/**
 * Set Entity
 */
@OwnableEntity('sets')
export class SetEntity extends BaseEntity {
    @Column()
    public code?: string;

    @Column()
    public name!: string;

    @Column({
        name: 'import_data',
    })
    public importData!: string;
}
