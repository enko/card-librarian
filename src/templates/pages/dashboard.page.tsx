/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';

interface DashboardPageProps {
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray overview
 */
const renderDashboardPage: React.FC<DashboardPageProps> = (props) => {
    const { t } = useTranslation();
    return <MainComponent
        currentUser={props.currentUser}
        title='Dashboard'>
        <p>{t('dashboard.greetings')}</p>
    </MainComponent>;
};

export default renderDashboardPage;
