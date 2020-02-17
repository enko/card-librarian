/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { LibraryEntity } from '../../entities/library.entity';
import { CardAssignment } from '../../models/card-assignment.model';
import MainComponent from '../components/main';
import SetComponent from '../components/set';

export interface LibraryCardAddPreviewProps {
    library: LibraryEntity;
    cards: CardAssignment[];
}

/**
 * Render a libray Detail
 */
const renderLibraryCardAddPreviewPage: React.FC<LibraryCardAddPreviewProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent title='Library'>
        <form method='post' action={`/libraries/${props.library.id}/cards/submit`} encType='multipart/form-data'>
            <table className='table is-fullwidth'>
                <thead>
                    <tr>
                        <th>{t('card.attributes.id.label')}</th>
                        <th>{t('card.attributes.type.label')}</th>
                        <th>{t('card.attributes.name.label')}</th>
                        <th>{t('card.attributes.colors.label')}</th>
                        <th>{t('card.attributes.manaCost.label')}</th>
                        <th>{t('card.attributes.set.label')}</th>
                        <th>{t('library.attributes.amount.label')}</th>
                        <th>{t('library.attributes.isFoil.label')}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.cards.map(item => <tr>
                        <td>{item.card.id}</td>
                        <td>{item.card.types}</td>
                        <td>{item.card.name}</td>
                        <td>{item.card.colors}</td>
                        <td>{item.card.manaCost}</td>
                        <td>
                            <SetComponent set={item.card.set} showIcon={true} showText={true} />
                        </td>
                        <td>
                            <input type='hidden' name='card_id[]' value={item.card.id} />
                            <input type='number' name='amount[]' value={item.amount} />
                        </td>
                        <td>
                            <input type='checkbox' name='isFoil[]' checked={item.isFoil} />
                        </td>
                    </tr>)}
                </tbody>
            </table>
            <button className='button' type='submit'>Submit</button>
        </form>
    </MainComponent>;
};

export default renderLibraryCardAddPreviewPage;
