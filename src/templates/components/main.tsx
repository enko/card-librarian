/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { UserExtensionEntity } from '../../entities/user-extension.entity';

export interface MainComponentProps {
    title: string;
    currentUser?: UserExtensionEntity;
}

/**
 * The base html framework
 */
const renderMainComponent: React.FC<MainComponentProps> = (props) => {
    const { t } = useTranslation();

    return <html>
        <head>
            <title>{props.title} - {t('appName')}</title>
            <link
                rel='stylesheet'
                href='https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.css'
                integrity='sha256-XF2msWsEjJwE8ORQ0exG5nFk8jDTntTMbUZKtvPRkgU='
                crossOrigin='anonymous' />
            <link
                rel='stylesheet'
                href='https://cdn.jsdelivr.net/npm/keyrune@3.6.3/css/keyrune.css'
                integrity='sha256-62nNl9FZJkhpbUBcBHarLscbVrYFFMHxoCoFPktCi/k='
                crossOrigin='anonymous'></link>
        </head>
        <body>

            <div className='container'>
                <div className='columns'>
                    <div className='column is-one-quarter'>
                        <aside className='menu'>
                            <p className='menu-label'>
                                {t('navbar.cardManagement')}
                            </p>
                            <ul className='menu-list'>
                                <li><a href='/'>{t('navbar.dashboard')}</a></li>
                                <li><a href='/libraries'>{t('navbar.libraries')}</a></li>
                                <li><a href='/decks'>{t('navbar.decks')}</a></li>
                            </ul>
                            <p className='menu-label'>
                                {t('navbar.userManagement')}
                            </p>
                            <ul className='menu-list'>
                                {(props.currentUser instanceof UserExtensionEntity ?
                                    <li>
                                        <a href='/users/logout'>{t('navbar.logout')}</a>
                                    </li> : <li>
                                        <a href='/users/login'>{t('navbar.login')}</a>
                                    </li>)}
                            </ul>
                        </aside>
                    </div>
                    <div className='column'>
                        {props.children}
                    </div>
                </div>
            </div>
        </body>
    </html>;
};

export default renderMainComponent;
