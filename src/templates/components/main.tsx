/*!
 * @copyright Card Librarian Team 2020
 */

import { TFunction } from 'i18next';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { UserExtensionEntity } from '../../entities/user-extension.entity';
import { ActionModel } from '../../models/action.model';

export interface MainComponentProps {
    title: string;
    currentUser?: UserExtensionEntity;
    actions?: ActionModel[];
}

/**
 * Render the navigation
 */
function renderNavigation(
    t: TFunction,
    props: React.PropsWithChildren<MainComponentProps>,
) {
    return <nav className='navbar is-dark' role='navigation' aria-label='main navigation'>
        <div className='container'>
            <div className='navbar-brand'>
                <a className='navbar-item' href='/'>
                    <img src='/assets/logo.svg' height='28' />
                </a>

                <a role='button' className='navbar-burger burger' aria-label='menu' aria-expanded='false' data-target='navbarBasicExample'>
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                </a>
            </div>

            <div className='navbar-menu'>
                <div className='navbar-start'>
                    <a className='navbar-item' href='/'>
                        {t('navbar.dashboard')}
                    </a>

                    <a accessKey='l' className='navbar-item' href='/libraries'>
                        {t('navbar.libraries')}
                    </a>
                    <a accessKey='d' className='navbar-item' href='/decks'>{t('navbar.decks')}</a>
                    <a className='navbar-item' href='/sets'>{t('navbar.sets')}</a>
                </div>

                <div className='navbar-end'>
                    <div className='navbar-item'>
                        <div className='buttons'>
                            {(props.currentUser instanceof UserExtensionEntity ?
                                <a className='button is-small' href='/users/logout'>{t('navbar.logout')}</a> :
                                <a className='button is-small' href='/users/login'>{t('navbar.login')}</a>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>;
}

/**
 * Render actions if available
 */
function renderActions(
    _t: TFunction,
    props: React.PropsWithChildren<MainComponentProps>,
) {
    if (!(typeof props.actions !== 'undefined' && Array.isArray(props.actions) && props.actions.length > 0)) {
        return [
            <h2 className='title'>{props.title}</h2>,
            props.children,
        ];
    }

    const actions = props.actions.map(action => {
        if (typeof action.isVisible !== 'function') {
            return <div className='action-item'>{action.elment}</div>;
        }

        if (action.isVisible()) {
            return <div className='action-item'>{action.elment}</div>;
        }

        return null;
    });

    return [
        <h2 className='title'>{props.title}</h2>,
        <div className='columns'>
            <div className='column is-four-fifths'>
                {props.children}
            </div>
            <div className='column actions'>
                {actions}
            </div>
        </div>,
    ];
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
            {renderNavigation(t, props)}
            <div className='section'>
                <div className='container'>
                    {renderActions(t, props)}
                </div>
            </div>
            <script src='/assets/navbar-toggle.js'></script>
        </body>
    </html>;
};

export default renderMainComponent;
