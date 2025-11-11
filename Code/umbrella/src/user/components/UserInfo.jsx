import React from 'react';
import { Buttons, ErrorDisplay } from './Commonness';
import { USERS, UMBRELLAS } from '../UserPageLogic';

export function UserInfo({ title, dispatch, userInfo, rentalMode, error }) {
    const [formData, setFormData] = React.useState(userInfo);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { phone, password, passwordConfirm } = formData;

        if (!phone || !password) {
            dispatch({ type: 'SET_ERROR', payload: '모든 정보를 입력해주세요.' });
            return;
        }

        if (rentalMode === 'BORROW' && password !== passwordConfirm) {
            dispatch({ type: 'SET_ERROR', payload: '일회용 비밀번호가 일치하지 않습니다. 다시 입력해주세요.' });
            return;
        }

        const authenticatedUser = USERS.find(user =>
            user.phone === phone && user.password === password
        );

        if (!authenticatedUser) {
            dispatch({ type: 'SET_ERROR', payload: '일치하는 사용자 정보가 없습니다. 다시 입력해주세요.' });
            return;
        }

        if (rentalMode === 'RETURN' || rentalMode === 'LOST_REPORT') {
            const hasRentedUmbrella = UMBRELLAS.some(u =>
                u.currentUserPhone === phone && u.status === '대여중'
            );

            if (!hasRentedUmbrella) {
                dispatch({ type: 'SET_ERROR', payload: '고객님 명의로 현재 대여 중인 우산이 없습니다.' });
                return;
            }
        }

        dispatch({ type: 'SET_USER_INFO', payload: { phone, password } });
        dispatch({ type: 'USER_AUTH_SUCCESS' });
    };

    const showConfirmPassword = rentalMode === 'BORROW';

    return (
        <div>
            <h2>{title}</h2>
            <ErrorDisplay message={error} />
            <div>
                <label> 전화번호:
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength="11" />
                </label>
                <label> 일회용 비밀번호 (4자리):
                    <input type="password" name="password" value={formData.password} onChange={handleChange} maxLength="4" />
                </label>

                {showConfirmPassword && (
                    <label> 비밀번호 확인 (4자리):
                        <input type="password" name="passwordConfirm" value={formData.passwordConfirm} onChange={handleChange} maxLength="4" />
                    </label>
                )}
            </div>
            <Buttons onClick={handleSubmit}>확인</Buttons>
        </div>
    );
}
