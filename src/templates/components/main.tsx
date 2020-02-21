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
            <link
                rel='stylesheet'
                href='https://cdn.jsdelivr.net/npm/mana-font@1.6.0/css/mana.css'
                integrity='sha256-7xF/sY4Jf/ZKQ4u12ImG7ZwkTmJVRvZ9+U1urvI3Sp8='
                crossOrigin='anonymous' />
            <link
                rel='stylesheet'
                href='/assets/styles.css' />
            <meta name='viewport' content='width=device-width, initial-scale=1.0' />
            <link
                rel='apple-touch-icon'
                sizes='180x180'
                href='/assets/apple-touch-icon.png' />
            <link
                rel='icon'
                type='image/png'
                sizes='32x32'
                href='/assets/favicon-32x32.png' />
            <link
                rel='icon'
                type='image/png'
                sizes='16x16'
                href='/assets/favicon-16x16.png' />
            <link
                rel='manifest'
                href='/assets/site.webmanifest' />
        </head>
        <body>
            <div className='container'>
                <nav className='navbar' role='navigation' aria-label='main navigation'>
                    <div className='navbar-brand'>
                        <a className='navbar-item' href='/'>
                            <img src='/assets/logo.svg' height='28' />
                        </a>

                        <a
                            role='button'
                            className='navbar-burger burger'
                            aria-label='menu'
                            aria-expanded='false'
                            data-target='navbarBasicExample'>
                            <span aria-hidden='true'></span>
                            <span aria-hidden='true'></span>
                            <span aria-hidden='true'></span>
                        </a>
                    </div>

                    <div id='navbarBasicExample' className='navbar-menu'>
                        <div className='navbar-start'>
                            <a className='navbar-item' href='/'>
                                {t('navbar.dashboard')}
                            </a>

                            <a className='navbar-item' href='/libraries'>
                                {t('navbar.libraries')}
                            </a>
                            <a className='navbar-item' href='/decks'>{t('navbar.decks')}</a>
                            <a className='navbar-item' href='/sets'>{t('navbar.sets')}</a>
                        </div>

                        <div className='navbar-end'>
                            <div className='navbar-item'>
                                <div className='buttons'>
                                    {(props.currentUser instanceof UserExtensionEntity ?
                                        <a className='button' href='/users/logout'>{t('navbar.logout')}</a> :
                                        <a className='button' href='/users/login'>{t('navbar.login')}</a>)}
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <div className='section'>
                <div className='container'>
                    {props.children}
                </div>
            </div>
            <script src='/assets/navbar-toggle.js'></script>
        </body>
    </html>;
};

export default renderMainComponent;
