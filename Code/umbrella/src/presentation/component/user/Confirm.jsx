import React, { useState } from 'react';
import { updateUmbrellaStat } from "../../../repositories/UmbrellaRepository";
import './Confirm.css';
import circleImg from '../../../assets/circle.png';
import LongUmbrellaImg from '../../../assets/Long.png';
import ShortUmbrellaImg from '../../../assets/Short.png';

export function Confirm({ mode, userData, umbrellaData, setStep }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        state: false,
        message: ""
    });

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            let userInfo = userData.user_id;
            const umbrella_id = umbrellaData.umbrella_id;
            if (mode === "defect_report") userInfo = userData.phone;

            const response = await updateUmbrellaStat(mode, userInfo, umbrella_id);
            const data = await response.json();

            if (!response.ok) {
                setError({ state: true, message: data.message });
                setIsLoading(false);
                return;
            }
            setStep(prev => (prev + 1));
        } catch (error) {
            console.error('확인 처리 오류:', error);
            setError({ state: true, message: "처리 중 오류가 발생했습니다." });
        } finally {
            setIsLoading(false);
        }
    };

    const modeLabel = {
        borrow: '대여',
        return: '반납',
        'loss-report': '분실 신고',
        loss_report: '분실 신고',
        defect_report: '고장 신고'
    }[mode] || '이용';

    return (
        <div className="confirm-page-container">
            <img src={circleImg} alt="" className="confirm-bg-circle" />

            <div className="confirm-header-texts">
                <div className="confirm-main-text">{modeLabel} 정보를 확인해주세요.</div>
                <div className="confirm-sub-text">입력하신 정보가 아래 내용과 맞나요?</div>
            </div>

            {error.state && <div className="confirm-error-msg">{error.message}</div>}

            <div className="confirm-info-card">
                <div className="confirm-asset-section">
                    <div className="confirm-icon-wrapper">
                        <img
                            src={umbrellaData.type === 'L' ? LongUmbrellaImg : ShortUmbrellaImg}
                            alt="선택한 우산"
                            className="confirm-asset-img"
                        />
                    </div>
                    <div className="confirm-umbrella-id">No. {umbrellaData.umbrella_id}</div>
                </div>

                <div className="receipt-divider">
                    <div className="receipt-groove"></div>
                </div>

                <div className="confirm-details-section">
                    <div className="confirm-form-group">
                        <div className="confirm-label-text">우산 종류</div>
                        <div className="confirm-input-container">
                            <input
                                type="text"
                                readOnly
                                value={umbrellaData.type === 'L' ? '장우산' : '단우산'}
                            />
                        </div>
                    </div>

                    <div className="confirm-form-group">
                        <div className="confirm-label-text">전화번호</div>
                        <div className="confirm-input-container">
                            <input
                                type="text"
                                readOnly
                                value={`${userData.phone.slice(0, 3)}-****-${userData.phone.slice(-4)}`}
                            />
                        </div>
                    </div>
                </div>

                <div className="neu-barcode-section">
                    <div className="neu-barcode-lines"></div>
                    <div className="neu-barcode-text">TICKET CONFIRMATION</div>
                </div>
            </div>

            <div className="neu-footer">
                <button type="button" className="neu-btn" onClick={() => setStep(prev => prev - 1)} disabled={isLoading}>
                    이전
                </button>
                <button type="button" className="neu-btn neu-btn-next" onClick={handleConfirm} disabled={isLoading}>
                    {isLoading ? '처리 중...' : '확인'}
                </button>
            </div>
        </div>
    );
}
