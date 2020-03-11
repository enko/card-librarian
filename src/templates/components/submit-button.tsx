/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Render a submit button
 */
function renderSubmitButton() {
    const { t } = useTranslation();

    return <button
        className='button'
        accessKey='s'
        type='submit'>
        {t('submit')}
    </button>;
}

export default renderSubmitButton;
