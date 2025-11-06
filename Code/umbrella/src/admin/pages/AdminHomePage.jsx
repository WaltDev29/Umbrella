import React from "react";
import {useNavigate} from "react-router-dom";

function AdminHomePage() {
    const navigate = useNavigate();
    
    // 더미 데이터
    const totalCount = 100;
    const rentalCount = 30;
    const brokenCount = 7;
    const lostCount = 5;
    const todayUserCount = 5;

    const moveToDashBoard = mode => {
        navigate("/dashboard", {state : {mode : [mode]}});
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
                <div>전체 우산 수 : {totalCount}개</div>
                <div>
                    <div>대여 중 : {rentalCount}개</div>
                    <div>고장 : {brokenCount}개</div>
                    <div>분실 : {lostCount}개</div>
                    <div>금일 이용자 : {todayUserCount}개</div>
                </div>
            </div>
        </div>
    )
}

export default AdminHomePage;