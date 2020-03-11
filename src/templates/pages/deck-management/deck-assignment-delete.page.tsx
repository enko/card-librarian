/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CardToDeckEntity } from '../../../entities/card-to-deck.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import MainComponent from '../../components/main';
import { renderErrors } from '../../components/render-errors';

interface DeckAssignmentDeletePageProps {
    assignment: CardToDeckEntity;
    currentUser: UserExtensionEntity;
    validationErrors?: ValidationError[];
}

/**
 * Render a form to edit a deck assignment
 */
function renderDeckAssignmentDeletePage(props: React.PropsWithChildren<DeckAssignmentDeletePageProps>) {
    const { t } = useTranslation();

    const submissionUrl = `/decks/${props.assignment.deck.id}/cards/${props.assignment.id}/delete`;

    return <MainComponent
        title={t('deck.assignment.delete.title', {
            deckName: props.assignment.deck.name,
            cardName: props.assignment.card.name,
        })}
        currentUser={props.currentUser}>
        <form method='POST' action={submissionUrl} encType='multipart/form-data'>
            {renderErrors(props.validationErrors)}
            <div className='field'>
                <label
                    htmlFor='input-deckassignment-deck'
                    className='label'>
                    {t('deck.assignment.delete.deckName')}
                </label>
                <div className='control'>
                    <input
                        id='input-deckassignment-amount'
                        className='input'
                        disabled={true}
                        value={props.assignment.deck.name} />
                </div>
            </div>
            <div className='field'>
                <label
                    className='label'>
                    {t('deck.assignment.delete.cardName')}
                </label>
                <div className='control'>
                    <input
                        id='input-card-name'
                        className='input'
                        disabled={true}
                        value={props.assignment.card.name} />
                </div>
            </div>
            <button
                className='button is-danger'
                type='submit'>
                {t('delete')}
            </button>
        </form>
    </MainComponent>;
}

export default renderDeckAssignmentDeletePage;
