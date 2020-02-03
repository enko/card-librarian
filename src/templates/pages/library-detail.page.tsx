/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { LibraryEntity } from '../../entities/library.entity';
import { UserExtensionEntity } from '../../entities/user-extension.entity';
import { isValue } from '../../helper/funcs';
import MainComponent from '../components/main';

export interface LibraryDetailPageProps {
    library: LibraryEntity;
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray Detail
 */
export class LibraryDetailPage extends React.Component<LibraryDetailPageProps & WithTranslation, {}> {
    /**
     * Reacts render method
     */
    public render() {

        const rows = (
            isValue(this.props.library.cardAssociations) && this.props.library.cardAssociations.length > 0 ?
                this.props.library.cardAssociations?.map(item => <tr>
                    <td>{item.card.id}</td>
                    <td>{item.card.name}</td>
                    <td>{item.card.colors}</td>
                    <td>{item.card.manaCost}</td>
                    <td>{item.amount}</td>
                </tr>) :
                null
        );

        return <MainComponent
            currentUser={this.props.currentUser}
            title={`${this.props.t('library.singular')} ${this.props.library.name}`}>
            <h2 className='title'>{this.props.library.name}</h2>
            <table className='table is-fullwidth'>
                <thead>
                    <tr>
                        <th>{this.props.t('library.cardOverview.id')}</th>
                        <th>{this.props.t('library.cardOverview.name')}</th>
                        <th>{this.props.t('library.cardOverview.colors')}</th>
                        <th>{this.props.t('library.cardOverview.manaCost')}</th>
                        <th>{this.props.t('library.cardOverview.amount')}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            {(this.props.currentUser instanceof UserExtensionEntity ?
                <form method='post' action={`/libraries/${this.props.library.id}/cards/preview`} encType='multipart/form-data'>
                    <div className='field'>
                        <label className='label'>{this.props.t('library.cardOverview.import')}</label>
                        <div className='control'>
                            <textarea className='textarea' name='import' />
                        </div>
                        <div className='content'>
                            <p>
                                {this.props.t('library.cardOverview.importHelp')}
                            </p>
                        </div>
                    </div>

                    <button className='button' type='submit'>{this.props.t('submit')}</button>
                </form>
                : null)}
        </MainComponent>;
    }
}

export default withTranslation()(LibraryDetailPage);
