/*!
 * @copyright Card Librarian Team 2020
 */

import * as React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

import { UserExtensionEntity } from '../../entities/user-extension.entity';

export interface MainComponentProps {
    title: string;
    currentUser?: UserExtensionEntity;
}

/**
 * The base html framework
 */
class MainComponent extends React.Component<MainComponentProps & WithTranslation, {}> {
    /**
     * Reacts render method
     */
    public render() {
        return <html>
            <head>
                <title>{this.props.title} - {this.props.t('appName')}</title>
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
                                    {this.props.t('navbar.cardManagement')}
                                </p>
                                <ul className='menu-list'>
                                    <li><a href='/'>{this.props.t('navbar.dashboard')}</a></li>
                                    <li><a href='/libraries'>{this.props.t('navbar.libraries')}</a></li>
                                    <li><a href='/decks'>{this.props.t('navbar.decks')}</a></li>
                                </ul>
                                <p className='menu-label'>
                                    {this.props.t('navbar.userManagement')}
                                </p>
                                <ul className='menu-list'>
                                    {(this.props.currentUser instanceof UserExtensionEntity ?
                                        <li>
                                            <a href='/users/logout'>{this.props.t('navbar.logout')}</a>
                                        </li> : <li>
                                            <a href='/users/login'>{this.props.t('navbar.login')}</a>
                                        </li>)}
                                </ul>
                            </aside>
                        </div>
                        <div className='column'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </body>
        </html>;
    }
}

export default withTranslation()(MainComponent);
