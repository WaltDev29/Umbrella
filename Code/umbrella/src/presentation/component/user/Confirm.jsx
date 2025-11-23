import React, {useState} from 'react';
import {updateUmbrellaStat} from "../../../repositories/UmbrellaRepository"

export function Confirm({ mode, userData, umbrellaData, setStep }) {
    const [isLoading, setIsLoading] = React.useState(false);

    const [error, setError] = useState({
        state : false,
        message : ""
    })

    const handleConfirm = async () => {
        setIsLoading(true);

        try {
            let userInfo = userData.user_id;
            let umbrella_id = umbrellaData.umbrella_id;

            // 고장 신고는 여기 안 거치는데, 코드에 있었으니까 일단 남겨둠.
            if (mode == "defect_report") userInfo = userData.phone;


            // API 호출
            const response = await updateUmbrellaStat(mode, userInfo, umbrella_id);

            const data = await response.json();

            if (!response.ok) {
                setError({state : true, message: data.message});
                setIsLoading(false);
                return;
            }

            // 성공 → 완료 페이지로
            setStep(prev => (prev+1));

        } catch (error) {
            console.error('에러:', error);
            setError({state : true, message: "처리 중 오류 발생"});
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const modeLabel = {
        'borrow': '대여',
        'return': '반납',
        'loss_report': '분실 신고',
        'defect_report': '고장 신고'
    }[mode];

    return (
        <div className="confirm-rental">
            <h2>{modeLabel} 정보 확인</h2>
            {error.state && <p>{error.message}</p>}

            <div className="confirm-details">
                <div className="detail-item">
                    <span className="label">종류:</span>
                    <span className="value">
            {umbrellaData.type === 'L' ? '장우산' : '단우산'}
          </span>
                </div>

                <div className="detail-item">
                    <span className="label">우산 번호:</span>
                    <span className="value">{umbrellaData.umbrella_id}</span>
                </div>

                <div className="detail-item">
                    <span className="label">전화번호:</span>
                    <span className="value">
            {userData.phone.slice(0, 3)}****{userData.phone.slice(-4)}
          </span>
                </div>

                <p className="warning">위 정보가 맞으신가요?</p>
            </div>

            <div className="buttons">
                <button
                    onClick={() => setStep(prev => (prev-1))}
                    disabled={isLoading}
                    className="back-btn"
                >
                    뒤로
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="confirm-btn"
                >
                    {isLoading ? '처리 중...' : '확인'}
                </button>
            </div>
        </div>
    );
}
