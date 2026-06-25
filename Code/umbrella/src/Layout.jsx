import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import logoImg from './assets/logo_small.png';
import './Layout.css';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';
    const isIndexPage = location.pathname === '/';

    // 사용자(키오스크) 페이지 경로 체크
    const userPaths = ['/userhomepage', '/rental', '/return', '/lost_report', '/defect_report', '/thanks'];
    const isUserPage = userPaths.includes(location.pathname);

    return (
        <div className="layout-container">
            {/* 인덱스 페이지(/)에서는 기본 헤더를 숨겨서 전체 화면 포스터 UI가 적용되게 함 */}
            {!isIndexPage && (
                <header className="app-header">
                    {/* 왼쪽: 홈 아이콘 버튼 (클릭 시 초기 인덱스 화면('/')으로 이동) */}
                    <button className="home-btn" onClick={() => navigate("/")}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="white"
                            width="32px"
                            height="32px"
                        >
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                        </svg>
                    </button>
                    {/* 중앙: 지정된 assets/logo.png 로고 이미지 */}
                    <div className="logo-container">
                        <img src={logoImg} alt="바로우산 로고" className="app-logo-center" />
                    </div>
                    {/* 오른쪽 여백 (Flex 사이 간격 맞추기용) */}
                    <div className="header-right-spacer"></div>
                </header>
            )}

            <main className={`app-main ${(isIndexPage || isUserPage) ? 'index-main' : ''}`}>
                <Outlet />
            </main>

            {/* 사용자 페이지가 아닐 때만 기본 푸터 표시 */}
            {!isUserPage && !isIndexPage && (
                <footer className="app-footer">
                    <button onClick={() => navigate('/')}>홈</button>
                    <button onClick={() => navigate(-1)} disabled={isHomePage}>뒤로가기</button>
                </footer>
            )}
        </div>
    );
}
