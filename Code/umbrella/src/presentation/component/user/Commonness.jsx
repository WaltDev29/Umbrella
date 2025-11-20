import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const handleHome = () => {
        dispatch({ type: 'RESET' });
        navigate('/');
    };

    return (
        <div>
            <Buttons
                onClick={() => dispatch({ type: 'GO_BACK' })}
                disabled={!canGoBack}
            >
                이전
            </Buttons>
            <Buttons onClick={handleHome}>홈</Buttons>
        </div>
    );
}
