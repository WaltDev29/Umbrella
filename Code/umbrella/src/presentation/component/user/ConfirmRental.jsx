import React from 'react';
import { Buttons, ErrorDisplay } from './Commonness';

export function ConfirmRental({ dispatch, state }) {
    const { cache } = state;
    const { userInfo, rentalMode, selectedUmbrellaID, selectedUmbrellaData } = cache;
    const [isProcessing, setIsProcessing] = React.useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            let endpoint = '';
            let body = {};

            // 엔드포인트와 바디 설정
            switch (rentalMode) {
                case 'BORROW':
                    endpoint = 'http://localhost:5000/api/umbrellas/borrow';
                    body = { user_id: userInfo.user_id, umbrella_id: selectedUmbrellaID };
                    break;

                case 'RETURN':
                    endpoint = 'http://localhost:5000/api/umbrellas/return';
                    body = { user_id: userInfo.user_id, umbrella_id: selectedUmbrellaID };
                    break;

                case 'LOST_REPORT':
                    endpoint = 'http://localhost:5000/api/umbrellas/loss-report';
                    body = { user_id: userInfo.user_id, umbrella_id: selectedUmbrellaID };
                    break;

                case 'DEFECT_REPORT':
                    endpoint = 'http://localhost:5000/api/umbrellas/defect-report';
                    body = { phone: userInfo.phone, umbrella_id: selectedUmbrellaID };
                    break;

                default:
                    throw new Error('알 수 없는 요청');
            }

            // API 호출
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({ type: 'SET_ERROR', payload: data.message || '처리 실패' });
                setIsProcessing(false);
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }

            // 성공 → 완료 페이지로
            dispatch({ type: 'NAVIGATE', payload: 'THANKS' });

        } catch (error) {
            console.error('에러:', error);
            dispatch({ type: 'SET_ERROR', payload: '처리 중 오류 발생' });
            setIsProcessing(false);
            dispatch({ type: 'SET_LOADING', payload: false });
        } finally {
            setIsProcessing(false);
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const modeLabel = {
        'BORROW': '대여',
        'RETURN': '반납',
        'LOST_REPORT': '분실 신고',
        'DEFECT_REPORT': '고장 신고'
    }[rentalMode];

    return (
        <div className="confirm-rental">
            <h2>{modeLabel} 정보 확인</h2>
            <ErrorDisplay message={state.error} />

            <div className="confirm-details">
                <div className="detail-item">
                    <span className="label">종류:</span>
                    <span className="value">
            {selectedUmbrellaData?.umbrella_type === 'L' ? '장우산' : '단우산'}
          </span>
                </div>

                <div className="detail-item">
                    <span className="label">우산 번호:</span>
                    <span className="value">{selectedUmbrellaID}</span>
                </div>

                <div className="detail-item">
                    <span className="label">전화번호:</span>
                    <span className="value">
            {userInfo.phone.slice(0, 3)}****{userInfo.phone.slice(-4)}
          </span>
                </div>

                <p className="warning">위 정보가 맞으신가요?</p>
            </div>

            <div className="buttons">
                <Buttons
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="confirm-btn"
                >
                    {isProcessing ? '처리 중...' : '확정'}
                </Buttons>

                <Buttons
                    onClick={() => dispatch({ type: 'GO_BACK' })}
                    disabled={isProcessing}
                    className="back-btn"
                >
                    돌아가기
                </Buttons>
            </div>
        </div>
    );
}
