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
    deck?: DeckEntity;
    validationErrors?: ValidationError[];
    currentUser: UserExtensionEntity;
}

const renderDeckEditPage: React.FC<DeckEditPageProps> = (props) => {
    const { t } = useTranslation();

    let submissionUrl: string;
    let title: string;

    if (props.deck instanceof DeckEntity) {
        submissionUrl = `/decks/${props.deck.id}`;
        title = t('deck.edit.title', { deckName: props.deck.name });
    } else {
        submissionUrl = `/decks`;
        title = t('deck.new.title');
    }

    return <MainComponent
        title={title}
        currentUser={props.currentUser}>
        <form method='POST' action={submissionUrl} encType='multipart/form-data'>
            {renderErrors(props.validationErrors)}
            <div className='field'>
                <label htmlFor='input-deck-name' className='label'>{t('deck.attributes.name.label')}</label>
                <div className='control'>
                    <input
                        id='input-deck-name'
                        className='input'
                        placeholder={t('deck.attributes.name.placeholder')}
                        autoFocus={true}
                        value={props.deck instanceof DeckEntity ? props.deck.name : undefined}
                        name='name' />
                </div>
                <p className='help'>{t('deck.attributes.name.help')}</p>
            </div>

            <div className='field'>
                <label htmlFor='input-is-public' className='label'>
                    {t('deck.attributes.isPublic.label')}
                </label>
                <div className='control'>
                    <input
                        id='input-is-public'
                        type='checkbox'
                        name='isPublic'
                        checked={props.deck instanceof DeckEntity ? props.deck.isPublic : undefined} />
                </div>
                <p className='help'>{t('deck.attributes.isPublic.help')}</p>
            </div>

            <button
                className='button'
                accessKey='s'
                type='submit'>
                {t('submit')}
            </button>
        </form>
    </MainComponent>;
};

export default renderDeckEditPage;
