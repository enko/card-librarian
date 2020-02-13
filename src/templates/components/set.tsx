/*!
 * @copyright Card Librarian Team 2020
 */


import React from 'react';

import { SetEntity } from '../../entities/set.entity';


interface SetComponentsProps {
    set: SetEntity;
    showIcon: boolean;
    showText: boolean;
}

/**
 * Show the set formated as a tag
 */
function renderSetComponent(props: SetComponentsProps) {
    return <div className='tags has-addons'>
        <span className='tag is-dark'>
            <i title={props.set.name} className={`ss ss-${props.set.code}`}></i>
        </span>
        <span className='tag'>{props.set.name}</span>
    </div>;
}

export default renderSetComponent;
