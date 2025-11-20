import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUmbrellaStatsController } from "../../../repositories/Controller";

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
                    // 아래는 스프레드 문법이라 하며, 대충 prevStats(업데이트 전 이전 내용),
                    // result.stats(업데이트 이후 내용)로 덮어쓰라는 의미임.
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
        <div>
            <h1>대시보드</h1>
            <div>
                <button onClick={() => moveToDashBoard("UMBRELLA")}>우산 목록</button>
                <button onClick={() => moveToDashBoard("USER")}>회원 목록</button>
                <button onClick={() => moveToDashBoard("LOG")}>이용 기록</button>
                <button onClick={() => navigate("/update-admin-info")}>관리자 계정 정보 수정</button>
            </div>
            <div>
                <div>전체 우산 수 : {stats.total}개</div>
                <div>
                    <div>대여 중 : {stats.R}개</div>
                    <div>고장 : {stats.B}개</div>
                    <div>분실 : {stats.L}개</div>
                    <div>금일 이용자 : {stats.todayUserCount}개</div>
                </div>
            </div>
        </div>
    )
}

export default AdminHomePage;