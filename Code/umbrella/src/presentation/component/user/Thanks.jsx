import React from 'react';
import { Buttons } from './Commonness';

export function Thanks({ dispatch, rentalMode }) {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: 'RESET' });
        }, 10000);

        return () => clearTimeout(timer);
    }, [dispatch]);

    const modeMessage = {
        BORROW: '대여가',
        RETURN: '반납이',
        LOST_REPORT: '분실 신고가',
        DEFECT_REPORT: '고장 신고가'
    };

    const message = modeMessage[rentalMode];

    return (
        <div>
            <h1>{message} 완료되었습니다. 감사합니다.</h1>
            <p>10초 뒤 초기 화면으로 돌아갑니다.</p>
            <Buttons onClick={() => dispatch({ type: 'RESET' })}>처음으로</Buttons>
        </div>
    );
}
