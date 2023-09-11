import React from 'react';

function Header(props) {
    return (
        <header>
            <nav>
                <div>FP ID: {props.fpId}</div>
            </nav>
        </header>
    );
}

export default Header;
