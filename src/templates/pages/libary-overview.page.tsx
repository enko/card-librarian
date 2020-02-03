/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

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
class LibraryOverviewPage extends React.Component<LibraryOverviewPageProps & WithTranslation, {}> {
    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent
            title={this.props.t('navbar.libraries')}
            currentUser={this.props.currentUser}>
            <h2 className='title'>{this.props.t('library.overview.title')}</h2>
            <table className='table is-fullwidth'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.libraries.map(item => [
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
            {(this.props.currentUser instanceof UserExtensionEntity ?
                <form method='post' encType='multipart/form-data'>
                    <div className='field'>
                        <label className='label'>{this.props.t('library.overview.name')}</label>
                        <div className='control'>
                            <input
                                className='input'
                                placeholder={this.props.t('library.overview.placeholder')}
                                name='name' />
                        </div>
                        <p className='help'>{this.props.t('library.overview.help')}</p>
                    </div>

                    <button className='button' type='submit'>{this.props.t('submit')}</button>
                </form>
                : null)}

        </MainComponent>;
    }
}

export default withTranslation()(LibraryOverviewPage);
