import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import index1 from '../../assets/index1.png';
import index2 from '../../assets/index2.png';
import index3 from '../../assets/index3.png';
import index4 from '../../assets/index4.png';

const images = [index1, index2, index3, index4];

const BackgroundContainer = styled.div`
    position: relative;
    width: 100vw;
    aspect-ratio: 9 / 16;
    max-height: 100vh;
    margin: 0 auto;
    overflow: hidden;
    background-color: #6fa8f4;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (min-width: 900px) and (min-aspect-ratio: 4/3) {
        width: 100vw;
        height: 100vh;
        aspect-ratio: auto;
        max-height: none;
        cursor: default;
        background:
            radial-gradient(circle at 18% 16%, rgba(126, 216, 223, 0.22), transparent 30%),
            radial-gradient(circle at 82% 18%, rgba(231, 236, 160, 0.22), transparent 30%),
            var(--baro-bg);
    }
`;

const ImageLayer = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    object-fit: cover;
    transition: opacity 1s ease-in-out;
    opacity: ${(props) => (props.$active ? 1 : 0)};
    z-index: 1;

    @media (min-width: 900px) and (min-aspect-ratio: 4/3) {
        top: 14vh;
        right: clamp(96px, 12vw, 210px);
        left: auto;
        width: min(520px, 34vw);
        height: min(680px, 68vh);
        object-fit: cover;
        border-radius: 28px;
        box-shadow: 0 28px 70px rgba(71, 98, 136, 0.18);
    }
`;

const AdminHiddenArea = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 15%;
    z-index: 20;
    background: var(--baro-surface-gradient);
    box-shadow: var(--baro-raised), var(--baro-edge);
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 900px) and (min-aspect-ratio: 4/3) {
        display: none;
    }
`;

const BannerText = styled.div`
    background: var(--baro-primary-gradient);
    color: white;
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: bold;
    padding: 15px 40px;
    border-radius: 50px;
    pointer-events: auto;
    box-shadow:
        9px 9px 18px rgba(101, 135, 190, 0.34),
        -7px -7px 16px rgba(247, 251, 255, 0.48),
        inset 1px 1px 2px rgba(255, 255, 255, 0.3);

    @media (min-width: 900px) and (min-aspect-ratio: 4/3) {
        font-size: clamp(1.35rem, 2vw, 2rem);
        padding: 16px 34px;
    }
`;

const WebLandingPanel = styled.section`
    display: none;

    @media (min-width: 900px) and (min-aspect-ratio: 4/3) {
        position: relative;
        z-index: 8;
        width: min(1120px, calc(100vw - 96px));
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(420px, 560px) minmax(340px, 520px);
        align-items: center;
        gap: clamp(48px, 7vw, 120px);
        pointer-events: none;
    }
`;

const WebLandingCopy = styled.div`
    pointer-events: auto;
`;

const WebEyebrow = styled.div`
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 7px 13px;
    margin-bottom: 20px;
    border-radius: 999px;
    background: rgba(47, 142, 233, 0.1);
    color: var(--baro-blue-dark);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
    font-size: 0.92rem;
    font-weight: 850;
`;

const WebTitle = styled.h1`
    margin: 0;
    color: #18345c;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
    font-size: clamp(2.55rem, 4.4vw, 4.75rem);
    font-weight: 900;
    line-height: 1.08;
    letter-spacing: 0;
    word-break: keep-all;

    span {
        display: block;
    }
`;

const WebDescription = styled.p`
    margin: 24px 0 0;
    max-width: 470px;
    color: #5f7492;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
    font-size: clamp(1.05rem, 1.4vw, 1.28rem);
    font-weight: 700;
    line-height: 1.7;
`;

const WebActions = styled.div`
    display: flex;
    gap: 12px;
    margin-top: 34px;
`;

const WebActionButton = styled.button`
    min-height: 52px;
    padding: 0 24px;
    border-radius: 12px;
    background: ${({ $variant }) => ($variant === 'primary' ? 'var(--baro-primary-gradient)' : '#ffffff')};
    color: ${({ $variant }) => ($variant === 'primary' ? '#ffffff' : '#4d6483')};
    box-shadow: ${({ $variant }) => ($variant === 'primary'
        ? '0 18px 36px rgba(71, 126, 205, 0.22)'
        : '0 12px 28px rgba(71, 98, 136, 0.1)')};
    border: ${({ $variant }) => ($variant === 'primary' ? '0' : '1px solid rgba(92, 121, 160, 0.16)')};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
    font-size: 1rem;
    font-weight: 850;
    cursor: pointer;
`;

function KioskStartPage() {
    const [currentImgIdx, setCurrentImgIdx] = useState(0);
    const navigate = useNavigate();
    const tapCountRef = React.useRef(0);
    const navTimeoutRef = React.useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImgIdx((prevIdx) => {
                let nextIdx;
                do {
                    nextIdx = Math.floor(Math.random() * images.length);
                } while (nextIdx === prevIdx && images.length > 1);
                return nextIdx;
            });
        }, 10000);

        return () => {
            clearInterval(interval);
            if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
        };
    }, []);

    const handleStart = () => {
        navigate('/userhomepage');
    };

    const handleWebStart = (e) => {
        e.stopPropagation();
        navigate('/userhomepage');
    };

    const handleWebAdmin = (e) => {
        e.stopPropagation();
        navigate('/login');
    };

    const handleAdminTap = (e) => {
        e.stopPropagation();
        tapCountRef.current += 1;

        if (navTimeoutRef.current) {
            clearTimeout(navTimeoutRef.current);
        }

        if (tapCountRef.current >= 6) {
            tapCountRef.current = 0;
            navigate('/login');
            return;
        }

        navTimeoutRef.current = setTimeout(() => {
            tapCountRef.current = 0;
            navigate('/userhomepage');
        }, 400);
    };

    return (
        <BackgroundContainer onClick={handleStart}>
            {images.map((img, idx) => (
                <ImageLayer
                    key={idx}
                    src={img}
                    $active={idx === currentImgIdx}
                    alt={`poster-${idx + 1}`}
                />
            ))}

            <WebLandingPanel>
                <WebLandingCopy>
                    <WebEyebrow>BARO UMBRELLA</WebEyebrow>
                    <WebTitle>
                        <span>비 오는 날,</span>
                        <span>우산을 바로 빌리고</span>
                        <span>바로 돌려주세요.</span>
                    </WebTitle>
                    <WebDescription>
                        가까운 보관함에서 전화번호와 PIN만으로 우산 대여, 반납, 신고까지 한 번에 처리할 수 있습니다.
                    </WebDescription>
                    <WebActions>
                        <WebActionButton $variant="primary" onClick={handleWebStart}>서비스 시작</WebActionButton>
                        <WebActionButton onClick={handleWebAdmin}>관리자 로그인</WebActionButton>
                    </WebActions>
                </WebLandingCopy>

            </WebLandingPanel>

            <AdminHiddenArea onClick={handleAdminTap}>
                <BannerText>화면을 터치해 시작하세요</BannerText>
            </AdminHiddenArea>
        </BackgroundContainer>
    );
}

export default KioskStartPage;
