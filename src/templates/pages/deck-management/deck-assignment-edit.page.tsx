/*!
 * @copyright Card Librarian Team 2020
 */

import { ValidationError } from 'class-validator';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CardToDeckEntity } from '../../../entities/card-to-deck.entity';
import { UserExtensionEntity } from '../../../entities/user-extension.entity';
import { CardToDeckType } from '../../../enums/card-to-deck-type.enum';
import MainComponent from '../../components/main';
import { renderErrors } from '../../components/render-errors';
import SubmitButton from '../../components/submit-button';

interface DeckAssignmentEditPageProps {
    assignment: CardToDeckEntity;
    currentUser: UserExtensionEntity;
    validationErrors?: ValidationError[];
}

/**
 * Render a form to edit a deck assignment
 */
function renderDeckAssignmentEditPage(props: React.PropsWithChildren<DeckAssignmentEditPageProps>) {
    const { t } = useTranslation();

    const submissionUrl = `/decks/${props.assignment.deck.id}/cards/${props.assignment.id}/edit`;

    return <MainComponent
        title={t('deck.assignment.edit.title', {
            deckName: props.assignment.deck.name,
            cardName: props.assignment.card.name,
        })}
        currentUser={props.currentUser}>
        <form method='POST' action={submissionUrl} encType='multipart/form-data'>
            {renderErrors(props.validationErrors)}
            <div className='field'>
                <label
                    htmlFor='input-card-name'
                    className='label'>
                    {t('card.attributes.name.label')}
                </label>
                <div className='control'>
                    <input
                        id='input-card-name'
                        className='input'
                        disabled={true}
                        value={props.assignment.card.name}
                        name='name' />
                </div>
            </div>
            <div className='field'>
                <label
                    htmlFor='input-deckassignment-amount'
                    className='label'>
                    {t('deck.attributes.amount.label')}
                </label>
                <div className='control'>
                    <input
                        id='input-deckassignment-amount'
                        className='input'
                        placeholder={t('deck.attributes.amount.placeholder')}
                        autoFocus={true}
                        value={props.assignment.amount}
                        name='amount' />
                </div>
                <p className='help'>{t('deck.attributes.amount.help')}</p>
            </div>
            <div className='field'>
                <label
                    htmlFor='input-deckassignment-type'
                    className='label'>
                    {t('deck.attributes.type.label')}
                </label>
                <div className='control'>
                    <select name='type' id='input-deckassignment-type'>
                        <option
                            selected={props.assignment.type === CardToDeckType.Main}
                            value='main'>
                            Main
                        </option>
                        <option
                            selected={props.assignment.type === CardToDeckType.SideBoard}
                            value='sideboard'>
                            Sideboard
                        </option>
                    </select>
                </div>
                <p className='help'>{t('deck.attributes.type.help')}</p>
            </div>
            <SubmitButton />
        </form>
    </MainComponent>;
}

export default renderDeckAssignmentEditPage;
