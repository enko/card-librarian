/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';

interface NotFoundPageProps {
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray overview
 */
class NotFoundPage extends React.Component<NotFoundPageProps & WithTranslation, {}> {
    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent
            currentUser={this.props.currentUser}
            title={this.props.t('notfound.title')}>
            <p>{this.props.t('notfound.message')}</p>
        </MainComponent>;
    }
}

export default withTranslation()(NotFoundPage);
