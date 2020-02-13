/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { LibraryEntity } from '../../entities/library.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import { isValue } from '../../helper/funcs';
import MainComponent from '../components/main';
import SetComponent from '../components/set';

export interface LibraryDetailPageProps {
    library: LibraryEntity;
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray Detail
 */
const renderLibraryDetailPage: React.FC<LibraryDetailPageProps> = (props) => {
    const { t } = useTranslation();

    const rows = (
        isValue(props.library.cardAssociations) && props.library.cardAssociations.length > 0 ?
            props.library.cardAssociations?.map(item => <tr>
                <td>
                    <SetComponent set={item.card.set} showIcon={true} showText={true} />
                </td>
                <td>{item.card.setNumber}</td>
                <td>{item.card.name}</td>
                <td>{item.card.colors}</td>
                <td>{item.card.manaCost}</td>
                <td>{item.amount}</td>
                <td>
                    <input type='checkbox' checked={item.isFoil} disabled={true} />
                </td>
            </tr>) :
            null
    );

    return <MainComponent
        currentUser={props.currentUser}
        title={`${t('library.singular')} ${props.library.name}`}>
        <h2 className='title'>{props.library.name}</h2>
        <table className='table is-fullwidth'>
            <thead>
                <tr>
                    <th>{t('library.cardOverview.set')}</th>
                    <th>{t('library.cardOverview.setNumber')}</th>
                    <th>{t('library.cardOverview.name')}</th>
                    <th>{t('library.cardOverview.colors')}</th>
                    <th>{t('library.cardOverview.manaCost')}</th>
                    <th>{t('library.cardOverview.amount')}</th>
                    <th>{t('library.cardOverview.isFoil')}</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        {(props.currentUser instanceof UserExtensionEntity ?
            <form method='post' action={`/libraries/${props.library.id}/cards/preview`} encType='multipart/form-data'>
                <div className='field'>
                    <label className='label'>{t('library.cardOverview.import')}</label>
                    <div className='control'>
                        <textarea className='textarea' name='import' />
                    </div>
                    <div className='content'>
                        <p>
                            {t('library.cardOverview.importHelp')}
                        </p>
                    </div>
                </div>

                <button className='button' type='submit'>{t('submit')}</button>
            </form>
            : null)}
    </MainComponent>;
};

export default renderLibraryDetailPage;
