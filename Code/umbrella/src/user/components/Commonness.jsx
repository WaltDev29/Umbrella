import React from 'react';

export function Buttons(props) {
    return (
        <button onClick={props.onClick} disabled={props.disabled}>
            {props.children}
        </button>
    );
}

export function ErrorDisplay({ message }) {
    if (!message) return null;
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

export function Header() {
    return (
        <div>
            <h1>우산 대여 시스템</h1>
        </div>
    );
}

export function Footer({ dispatch, canGoBack }) {
    return (
        <div>
            <Buttons
                onClick={() => dispatch({ type: 'GO_BACK' })}
                disabled={!canGoBack}
            >
                이전
            </Buttons>
            <Buttons onClick={() => dispatch({ type: 'RESET' })}>홈</Buttons>
        </div>
    );
}
