import React from 'react';
import { Buttons, ErrorDisplay } from './Commonness';
import { UMBRELLAS } from '../UserPageLogic';

export function UmbrellaSelect({ dispatch, state }) {
    const availableLong = UMBRELLAS.some(u => u.type === '장우산' && u.status === '대여가능');
    const availableShort = UMBRELLAS.some(u => u.type === '단우산' && u.status === '대여가능');

    const handleSelect = (type) => {
        if (state.rentalMode === 'BORROW') {
            if (type === 'LONG' && !availableLong) {
                dispatch({ type: 'SET_ERROR', payload: '선택하신 장우산 종류가 모두 대여중입니다.' });
                return;
            }
            if (type === 'SHORT' && !availableShort) {
                dispatch({ type: 'SET_ERROR', payload: '선택하신 단우산 종류가 모두 대여중입니다.' });
                return;
            }
        }
        dispatch({ type: 'SELECT_UMBRELLA', payload: type });
    }

    const isReportMode = state.rentalMode === 'LOST_REPORT';

    return (
        <div>
            <h2>우산 종류 선택 페이지</h2>
            <ErrorDisplay message={state.error} />
            <Buttons onClick={() => handleSelect('LONG')} disabled={!isReportMode && !availableLong}>
                장우산 {isReportMode ? '' : `(${availableLong ? '대여가능' : '대여중'})`}
            </Buttons>
            <Buttons onClick={() => handleSelect('SHORT')} disabled={!isReportMode && !availableShort}>
                단우산 {isReportMode ? '' : `(${availableShort ? '대여가능' : '대여중'})`}
            </Buttons>
        </div>
    );
}
