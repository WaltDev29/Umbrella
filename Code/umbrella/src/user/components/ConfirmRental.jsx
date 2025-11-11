import React from 'react';
import { Buttons, ErrorDisplay } from './Commonness';
import { UMBRELLAS } from '../UserPageLogic';

export function ConfirmRental({ dispatch, state }) {
    const { rentalMode, selectedUmbrella, selectedUmbrellaID, userInfo } = state;

    const userUmbrella = UMBRELLAS.find(u => u.currentUserPhone === userInfo.phone && u.status === '대여중');

    const titleMap = { BORROW: '대여 정보 확정', RETURN: '반납 정보 확인', LOST_REPORT: '분실 신고 확정' };
    const confirmText = { BORROW: '대여 실행', RETURN: '반납 완료', LOST_REPORT: '분실 신고' };

    if ((rentalMode === 'RETURN' || rentalMode === 'LOST_REPORT') && !userUmbrella) {
        return (
            <div>
                <ErrorDisplay message="고객님께서 대여 중인 우산 정보가 없습니다." />
                <Buttons onClick={() => dispatch({ type: 'NAVIGATE', payload: 'USER_HOME' })}>홈으로</Buttons>
            </div>
        );
    }

    const displayUmbrellaID = selectedUmbrellaID || 'ID 확인 불가';
    const isBorrowError = rentalMode === 'BORROW' && !selectedUmbrellaID;

    const handleConfirm = () => {
        if (isBorrowError) {
            dispatch({ type: 'SET_ERROR', payload: '오류가 발생했습니다. 다시 시도해 주세요.' });
            return;
        }
        console.log(`[${confirmText[rentalMode]}] 성공적으로 처리되었습니다. 우산 ID: ${displayUmbrellaID}`);
        dispatch({ type: 'CONFIRM_RENTAL_FINAL' });
    }

    return (
        <div>
            <h2>{titleMap[rentalMode]}</h2>
            <ErrorDisplay message={state.error} />

            {rentalMode === 'BORROW' && (
                <div>
                    <h3>대여하실 우산 정보</h3>
                    <p>우산 종류: {selectedUmbrella === 'LONG' ? '장우산' : '단우산'}</p>
                    <p>우산 고유 번호: {displayUmbrellaID}</p>
                    <p>우산 보관함에서 {displayUmbrellaID} 번호의 우산을 찾아 대여해주세요.</p>
                </div>
            )}

            {(rentalMode === 'RETURN' || rentalMode === 'LOST_REPORT') && (
                <div>
                    <h3>고객님이 대여하신 우산</h3>
                    <p>우산 번호: {userUmbrella?.id || '없음'}</p>
                    <p>우산 종류: {userUmbrella?.type}</p>
                    <p>반납 기한: (더미데이터에 없음)</p>
                </div>
            )}

            <p>전화번호: {userInfo.phone}</p>
            <Buttons onClick={handleConfirm} disabled={isBorrowError}>
                {confirmText[rentalMode]}
            </Buttons>
        </div>
    );
}
