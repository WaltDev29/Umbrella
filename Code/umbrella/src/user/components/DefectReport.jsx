import React from 'react';
import { Buttons, ErrorDisplay } from './Commonness';
import { UMBRELLAS } from '../UserPageLogic';

export function DefectReport({ dispatch, state }) {
    const [formData, setFormData] = React.useState(state.reportInfo);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { umbrellaID } = formData;

        const umbrellaExists = UMBRELLAS.some(u => u.id === umbrellaID);

        if (!umbrellaExists) {
            dispatch({ type: 'SET_ERROR', payload: '존재하지 않는 우산 번호입니다.' });
            return;
        }

        console.log(`우산 번호 ${umbrellaID}에 대한 고장 신고가 접수되었습니다.`);
        dispatch({ type: 'SET_REPORT_INFO', payload: formData });
        dispatch({ type: 'CONFIRM_REPORT_SUCCESS' });
    };

    return (
        <div>
            <h2>고장 신고</h2>
            <ErrorDisplay message={state.error} />
            <div>
                <label> 우산 고유번호:
                    <input type="text" name="umbrellaID" value={formData.umbrellaID} onChange={handleChange} maxLength="4" />
                </label>
                <p>예: U001 ~ U007</p>
            </div>
            <Buttons onClick={handleSubmit}>신고하기</Buttons>
        </div>
    );
}
