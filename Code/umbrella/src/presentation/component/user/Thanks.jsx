import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import thanksImg from '../../../assets/Thanks.png';
import './Thanks.css';

export default function Thanks() {
    const location = useLocation();
    const navigate = useNavigate();

    const modeMessage = {
        BORROW: '대여가',
        RETURN: '반납이',
        LOST_REPORT: '분실 신고가',
        DEFECT_REPORT: '고장 신고가'
    };

    const message = modeMessage[location.state?.mode] || '처리가';

    return (
        <div className="thanks-page-container">
            <div className="thanks-text-section">
                <div className="thanks-main-text">{message} 지금 완료되었어요!</div>
                {location.state?.mode === 'BORROW' ? (
                    <div className="thanks-sub-text">우산 보관함에서 번호에 맞는 우산을 챙겨가세요.</div>
                ) : (
                    <div className="thanks-sub-text">이용해주셔서 감사합니다.</div>
                )}
            </div>

            <div className="thanks-icon-wrapper">
                <img src={thanksImg} alt="완료 캐릭터" className="thanks-character-img" />
            </div>

            <div className="thanks-footer-section">
                <div className="thanks-timer-text">10초 뒤 초기 화면으로 돌아갑니다.</div>
                <button className="thanks-home-btn" onClick={() => navigate("/")}>
                    처음으로
                </button>
            </div>
        </div>
    );
}
