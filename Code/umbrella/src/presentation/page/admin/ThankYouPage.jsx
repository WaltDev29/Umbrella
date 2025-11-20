import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ThankYouPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(5);

    // 이전 페이지에서 전달받은 메시지 또는 기본 메시지
    const message = location.state?.message || '처리가 완료되었습니다.';
    const prevMode = location.state?.mode || "USER";

    const backToHome = () => {
        if (prevMode === "ADMIN") navigate("/admin-home");
        else navigate('/')
    };

    // 5초 뒤에 홈으로 이동하는 타이머 설정
    useEffect(() => {
        const timerId = setTimeout(() => {
            backToHome();
        }, 5000);

        // 1초마다 카운트다운을 업데이트하는 인터벌 설정
        const intervalId = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // 컴포넌트가 언마운트될 때 타이머와 인터벌을 정리합니다.
        return () => {
            clearTimeout(timerId);
            clearInterval(intervalId);
        };
    }, [navigate, prevMode]);

    return (
        <div
            onClick={backToHome}
            style={{ cursor: 'pointer', height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
            <h1>{message}</h1>
            <p>{countdown}초 뒤 홈으로 돌아갑니다.</p>
        </div>
    );
}