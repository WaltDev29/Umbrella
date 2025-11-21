import React from 'react';
import { Buttons, ErrorDisplay } from './Commonness';

export default function DefectReport2({ dispatch, state }) {
    const [formData, setFormData] = React.useState({
        phone: '',
        umbrella_id: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const { phone, umbrella_id } = formData;
        
        if (!phone) {
            dispatch({ type: 'SET_ERROR', payload: '휴대폰 번호를 입력해주세요.' });
            return;
        }

        if (!umbrella_id) {
            dispatch({ type: 'SET_ERROR', payload: '우산 번호를 입력해주세요.' });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // 하이픈 제거
            const normalizedPhone = phone.replace(/-/g, '');

            const response = await fetch('http://localhost:5000/api/umbrellas/defect-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: normalizedPhone,
                    umbrella_id: parseInt(umbrella_id)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                dispatch({ type: 'SET_ERROR', payload: data.message || '고장 신고 실패' });
                dispatch({ type: 'SET_LOADING', payload: false });
                return;
            }
            
            dispatch({ type: 'NAVIGATE', payload: 'THANKS' });

        } catch (error) {
            console.error('고장 신고 에러:', error);
            dispatch({ type: 'SET_ERROR', payload: '처리 중 오류 발생' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    return (
        <div className="defect-report">
            <h2>고장 신고</h2>
            <ErrorDisplay message={state.error} />

            <div className="form-group">
                <label>휴대폰 번호</label>
                <input
                    type="tel"
                    name="phone"
                    placeholder="01012345678"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={state.isLoading}
                />
            </div>

            <div className="form-group">
                <label>우산 번호</label>
                <input
                    type="number"
                    name="umbrella_id"
                    placeholder="우산 번호를 입력하세요"
                    value={formData.umbrella_id}
                    onChange={handleChange}
                    disabled={state.isLoading}
                />
            </div>

            <Buttons onClick={handleSubmit} disabled={state.isLoading}>
                {state.isLoading ? '신고 중...' : '고장 신고'}
            </Buttons>
        </div>
    );
}
