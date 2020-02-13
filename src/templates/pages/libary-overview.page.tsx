/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { LibraryEntity } from '../../entities/library.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';

export interface LibraryOverviewPageProps {
    libraries: LibraryEntity[];
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray overview
 */
const renderLibraryOverviewPage: React.FC<LibraryOverviewPageProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent
        title={t('navbar.libraries')}
        currentUser={props.currentUser}>
        <h2 className='title'>{t('library.overview.title')}</h2>
        <table className='table is-fullwidth'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {props.libraries.map(item => [
                    <tr>
                        <td>
                            <a href={`/libraries/${item.id}`}>
                                {item.id}
                            </a>
                        </td>
                        <td>
                            <a href={`/libraries/${item.id}`}>
                                {item.name}
                            </a>
                        </td>
                    </tr>,
                ])}
            </tbody>
        </table>
        {(props.currentUser instanceof UserExtensionEntity ?
            <form method='post' encType='multipart/form-data'>
                <div className='field'>
                    <label className='label'>{t('library.overview.name')}</label>
                    <div className='control'>
                        <input
                            className='input'
                            placeholder={t('library.overview.placeholder')}
                            name='name' />
                    </div>
                    <p className='help'>{t('library.overview.help')}</p>
                </div>

                <button className='button' type='submit'>{t('submit')}</button>
            </form>
            : null)}

    </MainComponent>;
};

export default renderLibraryOverviewPage;
