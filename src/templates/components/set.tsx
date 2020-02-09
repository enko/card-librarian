/*!
 * @copyright Card Librarian Team 2020
 */


import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

import { SetEntity } from '../../entities/set.entity';


interface SetComponentsProps {
    set: SetEntity;
    showIcon: boolean;
    showText: boolean;
}

/**
 * Show the set formated as a tag
 */
class SetComponent extends React.Component<SetComponentsProps & WithTranslation, {}> {

    /**
     * Reacts Render method
     */
    public render() {
        return <div className='tags has-addons'>
            <span className='tag is-dark'>
                <i title={this.props.set.name} className={`ss ss-${this.props.set.code}`}></i>
            </span>
            <span className='tag'>{this.props.set.name}</span>
        </div>;
    }
}

export default withTranslation()(SetComponent);
