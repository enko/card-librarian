/*!
 * @copyright Card Librarian Team 2020
 */


import React from 'react';

interface ManaCostComponentsProps {
    manaCost?: string;
}

/**
 * Show the set formated as a tag
 */
function renderManaCostComponent(props: ManaCostComponentsProps) {
    if (typeof props.manaCost === 'undefined') {
        return null;
    }

    const matches = props
        .manaCost
        .match(/(\{([A-Z0-9])\})/g);

    if (matches === null) {
        return null;
    }

    return <span>
        {matches.map(item => {
            return <i className={`ms ms-${item.replace('{', '').replace('}', '')} ms-cost`}></i>;
        })}
    </span>;
}

export default renderManaCostComponent;
