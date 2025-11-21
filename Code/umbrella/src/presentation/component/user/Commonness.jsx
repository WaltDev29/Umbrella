import React from 'react';
import { useNavigate } from 'react-router-dom';

// todo 이거 굳이 쓸 필요 없음.
export function Buttons(props) {
    return (
        <button onClick={props.onClick} disabled={props.disabled}>
            {props.children}
        </button>
    );
}

// todo 이것도 굳이 쓸 필요 없음. css 어떻게 입힐 지에 달린 듯
export function ErrorDisplay({ message }) {
    if (!message) return null;
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

// todo 이것도 필요없을듯
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
