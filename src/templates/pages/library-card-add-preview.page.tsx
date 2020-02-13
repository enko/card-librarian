/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { CardEntity } from '../../entities/card.entity';
import { LibraryEntity } from '../../entities/library.entity';
import MainComponent from '../components/main';
import SetComponent from '../components/set';

export interface LibraryCardAddPreviewProps {
    library: LibraryEntity;
    cards: CardEntity[];
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
                        <th>{t('library.cardPreview.id')}</th>
                        <th>{t('library.cardPreview.type')}</th>
                        <th>{t('library.cardPreview.name')}</th>
                        <th>{t('library.cardPreview.color')}</th>
                        <th>{t('library.cardPreview.manaCost')}</th>
                        <th>{t('library.cardPreview.set')}</th>
                        <th>{t('library.cardPreview.amount')}</th>
                        <th>{t('library.cardPreview.isFoil')}</th>
                    </tr>
                </thead>
                <tbody>
                    {props.cards.map(item => <tr>
                        <td>{item.id}</td>
                        <td>{item.types}</td>
                        <td>{item.name}</td>
                        <td>{item.colors}</td>
                        <td>{item.manaCost}</td>
                        <td>
                            <SetComponent set={item.set} showIcon={true} showText={true} />
                        </td>
                        <td>
                            <input type='hidden' name='card_id[]' value={item.id} />
                            <input type='number' name='amount[]' />
                        </td>
                        <td>
                            <input type='checkbox' name='isFoil[]' />
                        </td>
                    </tr>)}
                </tbody>
            </table>
            <button className='button' type='submit'>Submit</button>
        </form>
    </MainComponent>;
};

export default renderLibraryCardAddPreviewPage;
