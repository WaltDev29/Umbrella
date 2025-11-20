import React from 'react';
import {
    BorrowCheckController
} from '../../../services/Controller';
import { Buttons, ErrorDisplay } from './Commonness';

export function UserInfo({ dispatch, state, rentalMode }) {
    const [formData, setFormData] = React.useState({
        phone: '',
        password: '',
        passwordConfirm: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password' || name === 'passwordConfirm') {
            if (!/^\d*$/.test(value) || value.length > 4) return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const { phone, password, passwordConfirm } = formData;

        if (!phone) {
            dispatch({ type: 'SET_ERROR', payload: '휴대폰 번호를 입력해주세요.' });
            return;
        }

        if (!password) {
            dispatch({ type: 'SET_ERROR', payload: 'PIN을 입력해주세요.' });
            return;
        }

        if (rentalMode === 'BORROW' && password !== passwordConfirm) {
            dispatch({ type: 'SET_ERROR', payload: 'PIN이 일치하지 않습니다.' });
            return;
        }

        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            // ==================== 대여 ====================
            if (rentalMode === 'BORROW') {
                const result = await BorrowCheckController(phone, password);

                if (!result.valid) {
                    dispatch({ type: 'SET_ERROR', payload: result.error });
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }

                // 대여중이면 중단
                if (result.hasActiveLoan) {
                    dispatch({ type: 'SET_ERROR', payload: result.message });
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }

                dispatch({
                    type: 'UPDATE_CACHE_USER_INFO',
                    payload: {
                        phone,
                        password,
                        user_id: result.user.user_id,
                        isNewUser: result.isNewUser
                    }
                });

                dispatch({ type: 'NAVIGATE', payload: 'UMBRELLA_SELECT' });

                // ==================== 반납 / 분실 신고 ====================
            } else if (rentalMode === 'RETURN' || rentalMode === 'LOST_REPORT') {
                // 1. 사용자 인증
                const authResponse = await fetch('http://localhost:5000/api/users/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_tel: phone, user_pw: password })
                });

                if (!authResponse.ok) {
                    dispatch({ type: 'SET_ERROR', payload: '사용자 정보가 일치하지 않습니다.' });
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }

                const user = await authResponse.json();

                // 2. 사용자의 대여 우산 조회
                const borrowedResponse = await fetch('http://localhost:5000/api/umbrellas/borrowed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: user.user_id })
                });

                if (!borrowedResponse.ok) {
                    dispatch({ type: 'SET_ERROR', payload: '대여 중인 우산이 없습니다.' });
                    dispatch({ type: 'SET_LOADING', payload: false });
                    return;
                }

                const umbrella = await borrowedResponse.json();

                // 3. 캐시 저장
                dispatch({
                    type: 'UPDATE_CACHE_USER_INFO',
                    payload: {
                        phone,
                        password,
                        user_id: user.user_id
                    }
                });

                // 4. 우산 선택
                dispatch({
                    type: 'SELECT_UMBRELLA',
                    payload: {
                        type: umbrella.umbrella_type,
                        umbrellaId: umbrella.umbrella_id,
                        umbrellaData: umbrella
                    }
                });

                // 5. 확인 페이지로
                dispatch({ type: 'NAVIGATE', payload: 'CONFIRM' });
            }

        } catch (error) {
            console.error('에러:', error);
            dispatch({ type: 'SET_ERROR', payload: '처리 중 오류 발생' });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const isBorrow = rentalMode === 'BORROW';
    const titleMap = {
        'BORROW': '대여 정보',
        'RETURN': '반납 정보',
        'LOST_REPORT': '분실 신고'
    };

    return (
        <div className="user-info">
            <h2>{titleMap[rentalMode]}</h2>
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
                <label>4자리 PIN</label>
                <input
                    type="password"
                    name="password"
                    placeholder="••••"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength="4"
                    disabled={state.isLoading}
                />
            </div>

            {isBorrow && (
                <div className="form-group">
                    <label>PIN 확인</label>
                    <input
                        type="password"
                        name="passwordConfirm"
                        placeholder="••••"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        maxLength="4"
                        disabled={state.isLoading}
                    />
                </div>
            )}

            <Buttons onClick={handleSubmit} disabled={state.isLoading}>
                {state.isLoading ? '확인 중...' : '다음'}
            </Buttons>
        </div>
    );
}
