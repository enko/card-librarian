/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { LibraryEntity } from '../../../entities/library.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import MainComponent from '../../components/main';
import { renderErrors } from '../../components/render-errors';

interface LibraryAddCardsPageProps {
    library: LibraryEntity;
    validationErrors?: ValidationError[];
    currentUser: UserExtensionEntity;
}

const renderLibraryAddCardsPage: React.FC<LibraryAddCardsPageProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent
        title={t('library.addCards.title', { libraryName: props.library.name })}
        currentUser={props.currentUser}>
        <h2 className='title'>
            {t('library.addCards.title', { libraryName: props.library.name })}
        </h2>
        <form method='POST' action={`/libraries/${props.library.id}/cards/add`} encType='multipart/form-data'>
            {renderErrors(props.validationErrors)}
            <div className='field'>
                <label className='label'>{t('card.plural')}</label>
                <div className='control'>
                    <textarea className='textarea' name='cards' autoFocus={true} />
                </div>
                <div className='content'>
                    <p>
                        {t('library.addCards.importHelp')}
                    </p>
                </div>
            </div>

            <button className='button' type='submit' accessKey='s'>{t('submit')}</button>
        </form>
    </MainComponent>;
};

export default renderLibraryAddCardsPage;
