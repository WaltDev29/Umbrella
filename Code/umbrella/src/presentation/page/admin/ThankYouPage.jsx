import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./ThankYouPage.css";
import styled, {keyframes} from "styled-components"; // CSS 파일 import

const Container = styled.div`
    height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    cursor: pointer;
    text-align: center;
    user-select: none; /* 텍스트 드래그 방지 */
`;

const popIn = keyframes`
    from { transform: scale(0); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
`;

const IconWrapper = styled.div`
    width: 120px;
    height: 120px;
    background-color: #0056b3; /* 메인 블루 */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    box-shadow: 0 4px 15px rgba(0, 86, 179, 0.3);

    /* 애니메이션 효과 */
    animation: ${popIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

const Icon = styled.span`
    font-size: 60px;
    color: white;
    font-weight: bold;
`;

const Message = styled.h1`
    font-size: 48px;
    color: #333;
    font-weight: 900;
    margin-bottom: 20px;
`;

const Countdown = styled.p`
    font-size: 24px;
    color: #666;
    margin-bottom: 60px;
`;

const Second = styled.span`
    color: #0056b3;
    font-weight: bold;
    font-size: 30px;
`;

const blink = keyframes`
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
`;

const Hint = styled.p`
    font-size: 20px;
    color: #999;
    background-color: white;
    padding: 15px 30px;
    border-radius: 30px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);

    /* 깜빡이는 애니메이션 */
    animation: ${blink} 1.5s infinite;
`;

export default function ThankYouPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(5);

    // 이전 페이지에서 전달받은 메시지 또는 기본 메시지
    const message = location.state?.message || '처리가 완료되었습니다.';
    const prevMode = location.state?.mode || "USER";

    useEffect(() => {
        // state가 없거나 USER라면 홈으로
        if (!location.state || prevMode === "USER") {
            navigate("/", { replace: true });
        }
    }, [location.state, prevMode, navigate]);

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

        // 컴포넌트가 언마운트될 때 타이머와 인터벌을 정리
        return () => {
            clearTimeout(timerId);
            clearInterval(intervalId);
        };
    }, [navigate, prevMode]);

    return (
        <Container onClick={backToHome}>
            {/* 성공 체크 아이콘 */}
            <IconWrapper>
                <Icon>✔</Icon>
            </IconWrapper>

            {/* 메시지 */}
            <Message>{message}</Message>

            {/* 카운트다운 */}
            <Countdown>
                <Second>{countdown}</Second>초 뒤 홈으로 돌아갑니다.
            </Countdown>

            {/* 터치 힌트 */}
            <Hint>
                화면을 터치하면 바로 이동합니다 👆
            </Hint>
        </Container>
    );
}