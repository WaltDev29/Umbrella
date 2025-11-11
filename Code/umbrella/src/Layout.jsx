import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    const isHomePage = location.pathname === '/';

    // 사용자 페이지 경로 체크
    const isUserPage = location.pathname === '/userhomepage';

    return (
        <div className="layout-container">
            <header className="app-header">
                <img src="/logo.png" alt="logo" className="app-logo" />
                <h1>우산 대여 시스템</h1>
            </header>

            <main className="app-main">
                <Outlet />
            </main>

            {/* 사용자 페이지가 아닐 때만 기본 푸터 표시 */}
            {!isUserPage && (
                <footer className="app-footer">
                    <button onClick={() => navigate('/')}>홈</button>
                    <button onClick={() => navigate(-1)} disabled={isHomePage}>뒤로가기</button>
                </footer>
            )}
        </div>
    );
}
