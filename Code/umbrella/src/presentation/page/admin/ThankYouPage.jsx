import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./ThankYouPage.css"; // CSS 파일 import

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
        <div className="thankyou-container" onClick={backToHome}>
            {/* 성공 체크 아이콘 */}
            <div className="success-icon-circle">
                <span className="success-checkmark">✔</span>
            </div>

            {/* 메시지 */}
            <h1 className="thankyou-message">{message}</h1>

            {/* 카운트다운 */}
            <p className="countdown-text">
                <span className="countdown-number">{countdown}</span>초 뒤 홈으로 돌아갑니다.
            </p>

            {/* 터치 힌트 */}
            <div className="touch-hint">
                화면을 터치하면 바로 이동합니다 👆
            </div>
        </div>
    );
}