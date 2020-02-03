/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import { UserExtensionEntity } from '../../entities/user-extension.entity';
import { MainComponent } from '../components/main';

interface DashboardPageProps {
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray overview
 */
class DashboardPage extends React.Component<DashboardPageProps & WithTranslation, {}> {
    /**
     * Reacts render method
     */
    public render() {
        return <MainComponent
            currentUser={this.props.currentUser}
            title='Dashboard'>
            <p>{this.props.t('dashboard.greetings')}</p>
        </MainComponent>;
    }
}

export default withTranslation()(DashboardPage);
