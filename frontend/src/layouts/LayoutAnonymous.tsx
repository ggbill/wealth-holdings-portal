import React from 'react';
import './layoutAnonymous.scss';

const LayoutAnonymous = props => {
    return (
        <>
            <div className="anonymous-layout">
                {props.children}
            </div>
        </>
    )
}

export default LayoutAnonymous