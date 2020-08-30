/*!
 * @copyright Card Librarian Team 2020
 */

import { NullAble } from '@flyacts/backend';

/**
 * Checks if the value is nullable
 */
export function isValue<T>(value: NullAble<T>): value is T {
    if (value === null) {
        return false;
    }

    if (typeof value === 'undefined') {
        return false;
    }

    return true;
}

/**
 * Return a regex for uuids
 */
export function getUUIDRegEx() {
    return '[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}';
}
