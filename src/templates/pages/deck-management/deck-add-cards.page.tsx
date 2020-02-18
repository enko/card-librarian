/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { DeckEntity } from '../../../entities/deck.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import MainComponent from '../../components/main';
import { renderErrors } from '../../components/render-errors';

interface DeckEditPageProps {
    deck: DeckEntity;
    validationErrors?: ValidationError[];
    currentUser: UserExtensionEntity;
}

const renderDeckEditPage: React.FC<DeckEditPageProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent
        title={t('deck.addCards.title', { deckName: props.deck.name })}
        currentUser={props.currentUser}>
        <h2 className='title'>
            {t('deck.addCards.title', { deckName: props.deck.name })}
        </h2>
        <form method='POST' action={`/decks/${props.deck.id}/cards/add`} encType='multipart/form-data'>
            {renderErrors(props.validationErrors)}
            <div className='field'>
                <label className='label'>{t('card.plural')}</label>
                <div className='control'>
                    <textarea className='textarea' name='cards' autoFocus={true} />
                </div>
                <div className='content'>
                    <p>
                        {t('deck.addCards.importHelp')}
                    </p>
                </div>
            </div>

            <button className='button' type='submit'>{t('submit')}</button>
        </form>
    </MainComponent>;
};

export default renderDeckEditPage;
