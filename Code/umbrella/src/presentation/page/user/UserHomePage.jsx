import React from 'react';
import { useNavigate } from "react-router-dom";
import './UserHomePage.css';
import cloudImg from '../../../assets/cloud.png';

function UserHomePage() {
    const navigate = useNavigate();

    return (
        <div className="user-home-page">
            <img src={cloudImg} alt="구름 배경" className="cloudbackground" />

            <div className="weather-hero-card">
                <div className="weather-container" aria-hidden="true">
                    <span className="weather-sun weather-sunshine"></span>
                    <span className="weather-sun"></span>
                    <div className="weather-cloud weather-front">
                        <span className="weather-left-front"></span>
                        <span className="weather-right-front"></span>
                    </div>

                    <span className="weather-drop drop-1"></span>
                    <span className="weather-drop drop-2"></span>
                    <span className="weather-drop drop-3"></span>
                    <span className="weather-drop drop-4"></span>

                    <div className="weather-cloud weather-back">
                        <span className="weather-left-back"></span>
                        <span className="weather-right-back"></span>
                    </div>
                </div>

                <div className="weather-card-header">
                    <span>바로 빌리고,<br />바로 돌려주는 우산</span>
                    <span>비 오는 날에도 가볍게<br />가까운 보관함에서 바로 이용하세요.</span>
                </div>

                <span className="weather-temp">BARO°</span>

                <div className="weather-scale">
                    <span>P.A.S.S</span>
                </div>
            </div>

            <main className="button-grid">
                <button
                    className="mockup-card"
                    onClick={() => navigate("/rental", { state: { mode: "RENTAL" } })}
                >
                    <div className="mockup-title">대여하기</div>
                    <div className="mockup-desc">{"우산이 필요하신가요?\n지금 바로 대여를 시작해보세요."}</div>
                </button>

                <button
                    className="mockup-card"
                    onClick={() => navigate("/return", { state: { mode: "RETURN" } })}
                >
                    <div className="mockup-title">반납하기</div>
                    <div className="mockup-desc">{"우산 잘 쓰셨나요?\n이제 보관함에 돌려주세요."}</div>
                </button>

                <button
                    className="mockup-card"
                    onClick={() => navigate("/lost_report", { state: { mode: "LOST_REPORT" } })}
                >
                    <div className="mockup-title">분실신고</div>
                    <div className="mockup-desc">{"우산을 잃어버리셨나요?\n걱정 말고 바로 신고하세요."}</div>
                </button>

                <button
                    className="mockup-card"
                    onClick={() => navigate("/defect_report", { state: { mode: "DEFECT_REPORT" } })}
                >
                    <div className="mockup-title">고장신고</div>
                    <div className="mockup-desc">{"우산에 문제가 있나요?\n상태를 알려주시면 확인할게요."}</div>
                </button>
            </main>
        </div>
    );
}

export default UserHomePage;
