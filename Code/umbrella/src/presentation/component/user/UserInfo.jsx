import React, {useState} from 'react';
import {BorrowCheckController} from '../../../services/Controller';
import {checkUserByTelAndPw} from "../../../repositories/UserRepository";
import {checkBorrowedUmbrella} from "../../../services/Controller";

export function UserInfo({mode, setUserData, setUmbrellaData, setStep }) {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        passwordConfirm: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState({
        state : false,
        message : ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password' || name === 'passwordConfirm') {
            if (!/^\d*$/.test(value) || value.length > 4) return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const validateInfo = (phone, password, passwordConfirm) => {
        let result = true;
        if (!phone) {
            setError({state: true, message: "휴대폰 번호를 입력해주세요."});
            result = false;
        }

        if (!password) {
            setError({state: true, message: "PIN을 입력해주세요."});
            result = false;
        }

        if (mode === 'BORROW' && password !== passwordConfirm) {
            setError({state: true, message: "PIN이 일치하지 않습니다."});
            result = false;
        }
        return result;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        const { phone, password, passwordConfirm } = formData;

        if (!validateInfo(phone, password, passwordConfirm)) return;

        setIsLoading(true);

        try {
            // ==================== 대여 ====================
            if (mode === 'BORROW') {
                const result = await BorrowCheckController(phone, password);

                if (!result.valid) {
                    setError({state: true, message: result.error})
                    setIsLoading(false);
                    return;
                }

                // 대여중이면 중단
                if (result.hasActiveLoan) {
                    setError({state : true, message : result.message})
                    setIsLoading(false);
                    return;
                }

                // dispatch({
                //     type: 'UPDATE_CACHE_USER_INFO',
                //     payload: {
                //         phone,
                //         password,
                //         user_id: result.user.user_id,
                //         isNewUser: result.isNewUser
                //     }
                // });

                setUserData({
                    user_id: result.user.user_id,
                    phone: phone,
                    password: password
                })

                setStep(prev => (prev+1));

                // ==================== 반납 / 분실 신고 ====================
            } else if (mode === 'RETURN' || mode === 'LOST_REPORT') {
                // 1. 사용자 인증
                // const authResponse = await fetch('http://localhost:5000/api/users/auth', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ user_tel: phone, user_pw: password })
                // });

                const user = await checkUserByTelAndPw(phone, password);

                if (!user) {
                    setError({state: true, message: "사용자 정보가 일치하지 않습니다."});
                    setIsLoading(false);
                    return;
                }

                // const user = await authResponse.json();

                // 2. 사용자의 대여 우산 조회
                // const borrowedResponse = await fetch('http://localhost:5000/api/umbrellas/borrowed', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ user_id: user.user_id })
                // });

                const umbrella = await checkBorrowedUmbrella(user.user_id);

                if (!umbrella) {
                    setError({state: true, message: "대여 중인 우산이 없습니다."});
                    setIsLoading(false);
                    return;
                }

                // 3. 캐시 저장
                // dispatch({
                //     type: 'UPDATE_CACHE_USER_INFO',
                //     payload: {
                //         phone,
                //         password,
                //         user_id: user.user_id
                //     }
                // });

                setUserData({
                    user_id: user.user_id,
                    phone: phone,
                    password: password
                })

                // setStep("SELECT_UMBRELLA");

                // 4. 우산 선택
                setUmbrellaData({
                    umbrella_id: umbrella.umbrella_id,
                    type: umbrella.umbrella_type,
                });

                // dispatch({
                //     type: 'SELECT_UMBRELLA',
                //     payload: {
                //         type: umbrella.umbrella_type,
                //         umbrellaId: umbrella.umbrella_id,
                //         umbrellaData: umbrella
                //     }
                // });

                // 5. 확인 페이지로
                setStep(prev => (prev+1));
                // dispatch({ type: 'NAVIGATE', payload: 'CONFIRM' });
            }

        } catch (error) {

            console.error('에러:', error);
            setError({state: true, message: "처리 중 오류 발생"});
        }
        finally {
            setIsLoading(false);
        }
    };

    const titleMap = {
        'BORROW': '대여 정보',
        'RETURN': '반납 정보',
        'LOST_REPORT': '분실 신고'
    };

    return (
        <form className="user-info" onSubmit={handleSubmit}>
            <h2>{titleMap[mode]}</h2>
            {error.state && <p>{error.message}</p>}

            <div className="form-group">
                <label>휴대폰 번호</label>
                <input
                    type="tel"
                    name="phone"
                    placeholder="01012345678"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
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
                    disabled={isLoading}
                />
            </div>

            {mode === 'BORROW' && (
                <div className="form-group">
                    <label>PIN 확인</label>
                    <input
                        type="password"
                        name="passwordConfirm"
                        placeholder="••••"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        maxLength="4"
                        disabled={isLoading}
                    />
                </div>
            )}

            <button type="button" onClick={() => setStep(prev => Math.max(prev-1,0))}>뒤로</button>
            <button type="submit" disabled={isLoading}>
                {isLoading ? '확인 중...' : '다음'}
            </button>
        </form>
    );
}
