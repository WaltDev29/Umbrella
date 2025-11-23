import React from 'react';
import {useNavigate} from "react-router-dom";

function UserHomePage() {
    const navigate = useNavigate();

    return (
        <div className="user-home-page">
            <main>
                {/*<h1>우산 대여 시스템</h1>*/}
                <button onClick={() => navigate("/rental", {state: {mode: "RENTAL"}})}>
                    우산 대여
                </button>

                <button onClick={() => navigate("/return", {state: {mode: "RETURN"}})}>
                    우산 반납
                </button>

                <button onClick={() => navigate("/lost_report", {state: {mode: "LOST_REPORT"}})}>
                    분실 신고
                </button>

                <button onClick={() => navigate("/defect_report", {state: {mode: "DEFECT_REPORT"}})}>
                    고장 신고
                </button>
            </main>


            <div className="nav-buttons">
                <button onClick={() => navigate("/")}>← 뒤로</button>
                <button onClick={() => navigate("/")}>홈</button>
            </div>
        </div>
    );
}

export default UserHomePage;
