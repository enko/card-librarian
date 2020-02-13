/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { UserExtensionEntity } from '../../entities/user-extension.entity';
import MainComponent from '../components/main';

interface NotFoundPageProps {
    currentUser?: UserExtensionEntity;
}

/**
 * Render a libray overview
 */
const renderNotFoundPage: React.FC<NotFoundPageProps> = (props) => {
    const { t } = useTranslation();

    return <MainComponent
        currentUser={props.currentUser}
        title={t('notfound.title')}>
        <p>{t('notfound.message')}</p>
    </MainComponent>;
};

export default renderNotFoundPage;
