/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import * as React from 'react';

/**
 * Render potential errors
 */
export function renderErrors(validationErrors?: ValidationError[]) {
    if (!Array.isArray(validationErrors)) {
        return null;
    }

    if (validationErrors.length === 0) {
        return null;
    }

    return <div className='notification is-danger is-light'>
        <ul>
            {validationErrors
                .map(item => Object.values(item.constraints))
                .map(item => <li>{item}</li>)}
        </ul>
    </div>;

}
