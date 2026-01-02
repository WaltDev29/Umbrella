import React, {useState, useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getUmbrellaStatsController} from "../../../services/Controller";
import styled from "styled-components";

import NavCardBtn from "../../component/admin/NavCardBtn";
import StatCard from "../../component/admin/StatCard";
import AdminLayout from "../../component/admin/AdminLayout";
import Title from "../../component/admin/Title";

const Grid = styled.section`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;

    @media (max-width: 1023px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
`;

const UserStatText = styled.div`
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    color: #333;
    padding-bottom: 10px;
    //border-bottom: 2px dashed #ddd;

    @media screen and (max-width: 1023px), screen and (orientation: portrait) {
        font-size: 30px;
    }
`;

const Highlight = styled.span`
    color: #28a745;
    margin-left: 15px;
    font-size: 48px;

    @media screen and (max-width: 1023px), screen and (orientation: portrait) {
        font-size: 48px;
    }
`;

function AdminHomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const valid = location.state?.valid;

    useEffect(() => {
        if (!valid) navigate("/");
    }, [location, valid]);

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
        navigate("/dashboard", {state: {mode: mode}});
    }

    return (
        <AdminLayout page="home">
            <header>
                <Title>관리자 대시보드</Title>
            </header>

            <Grid>
                <NavCardBtn
                    variant="umbrella"
                    moveToDashboard={moveToDashBoard}
                    direction="UMBRELLA"
                    text="🌂 우산 목록 관리"
                />
                <NavCardBtn
                    variant="user"
                    moveToDashboard={moveToDashBoard}
                    direction="USER"
                    text="👥 회원 목록 관리"
                />
                <NavCardBtn
                    variant="log"
                    moveToDashboard={moveToDashBoard}
                    direction="LOG"
                    text="📋 이용 기록 조회"
                />
                <NavCardBtn
                    variant="admin"
                    moveToDashboard={navigate}
                    direction="/update-admin-info"
                    text="⚙️ 관리자 정보 수정"
                />
            </Grid>

            <section>
                <UserStatText>
                    금일 방문 이용자 <Highlight>{stats.todayUserCount}명</Highlight>
                </UserStatText>

                <Grid>
                    <StatCard
                        variant="total"
                        label="전체 우산"
                        data={stats.total}
                    />
                    <StatCard
                        variant="rented"
                        label="대여 중"
                        data={stats.R}
                    />
                    <StatCard
                        variant="broken"
                        label="고장"
                        data={stats.B}
                    />
                    <StatCard
                        variant="lost"
                        label="분실"
                        data={stats.L}
                    />
                </Grid>
            </section>
        </AdminLayout>
    )
}

export default AdminHomePage;