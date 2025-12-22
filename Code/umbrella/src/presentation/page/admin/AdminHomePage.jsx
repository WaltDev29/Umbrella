import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUmbrellaStatsController } from "../../../services/Controller";
import "./AdminHomePage.css";
import "./AdminCommon.css";

function AdminHomePage() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total: 0,
        R: 0,
        B: 0,
        L: 0,
        todayUserCount: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const result = await getUmbrellaStatsController();

            if (result.success && result.stats) {
                setStats(prevStats => ({
                    ...prevStats,
                    ...result.stats
                }));
            }
        };

        fetchStats();
    }, []);

    const moveToDashBoard = mode => {
        navigate("/dashboard", { state: { mode: mode } });
    }

    return (
        <div className="admin-home-container admin-layout">
            <header>
                <h1 className="home-title">관리자 대시보드</h1>
            </header>

            <section className="nav-grid">
                <button className="nav-card-btn btn-umbrella" onClick={() => moveToDashBoard("UMBRELLA")}>
                    🌂 우산 목록 관리
                </button>
                <button className="nav-card-btn btn-user" onClick={() => moveToDashBoard("USER")}>
                    👥 회원 목록 관리
                </button>
                <button className="nav-card-btn btn-log" onClick={() => moveToDashBoard("LOG")}>
                    📋 이용 기록 조회
                </button>
                <button className="nav-card-btn btn-admin" onClick={() => navigate("/update-admin-info")}>
                    ⚙️ 관리자 정보 수정
                </button>
            </section>

            <section className="stats-container">
                <div className="user-stat-text">
                    금일 방문 이용자 <span className="highlight">{stats.todayUserCount}명</span>
                </div>

                <div className="stats-grid-responsive">
                    <div className="stat-card card-total">
                        <span className="stat-label">전체 우산</span>
                        <span className="stat-value">{stats.total}</span>
                    </div>

                    <div className="stat-card card-rented">
                        <span className="stat-label">대여 중</span>
                        <span className="stat-value">{stats.R}</span>
                    </div>

                    <div className="stat-card card-broken">
                        <span className="stat-label">고장</span>
                        <span className="stat-value">{stats.B}</span>
                    </div>

                    <div className="stat-card card-lost">
                        <span className="stat-label">분실</span>
                        <span className="stat-value">{stats.L}</span>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AdminHomePage;