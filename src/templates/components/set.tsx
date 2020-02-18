/*!
 * @copyright Card Librarian Team 2020
 */


import React from 'react';

import { SetEntity } from '../../entities/set.entity';


interface SetComponentsProps {
    set: SetEntity;
    showIcon: boolean;
    showText: boolean;
    additionalRootClasses?: string;
    additionalIconClasses?: string;
    additionalTextClasses?: string;
}

/**
 * Show the set formated as a tag
 */
function renderSetComponent(props: SetComponentsProps) {
    const rootClassName = ['tags'];

    if (props.showText && props.showIcon) {
        rootClassName.push('has-addons');
    }

    if (typeof props.additionalRootClasses === 'string') {
        rootClassName.push(props.additionalRootClasses);
    }

    const iconClassName = ['tag', 'is-dark'];

    if (typeof props.additionalIconClasses === 'string') {
        iconClassName.push(props.additionalIconClasses);
    }

    const textClassName = ['tag'];

    if (typeof props.additionalTextClasses === 'string') {
        textClassName.push(props.additionalTextClasses);
    }

    return <div className={rootClassName.join(' ')}>
        {props.showIcon ?
            <span className={iconClassName.join(' ')}>
                <i title={props.set.name} className={`ss ss-${props.set.code}`}></i>
            </span> :
            null}
        {props.showText ? <span className={textClassName.join(' ')}>{props.set.name}</span> : null}
    </div>;
}

export default renderSetComponent;
