import React, { useState } from 'react';
import { BorrowCheckController } from '../../../services/Controller';
import { checkUserByTelAndPw } from "../../../repositories/UserRepository";
import { checkBorrowedUmbrella } from "../../../services/Controller";
import './UserInfo.css';
import phoneImg from '../../../assets/phone.png';
import lockImg from '../../../assets/lock.png';
import keyImg from '../../../assets/key.png';

export function UserInfo({ mode, setUserData, setUmbrellaData, setStep }) {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
        passwordConfirm: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        state: false,
        message: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'password' || name === 'passwordConfirm') {
            if (!/^\d*$/.test(value) || value.length > 4) return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const validateInfo = (phone, password, passwordConfirm) => {
        if (!phone) {
            setError({ state: true, message: "전화번호를 입력해주세요." });
            return false;
        }

        if (!password) {
            setError({ state: true, message: "PIN 번호를 입력해주세요." });
            return false;
        }

        if (mode === 'BORROW' && password !== passwordConfirm) {
            setError({ state: true, message: "PIN 번호가 일치하지 않습니다." });
            return false;
        }

        setError({ state: false, message: "" });
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        const { phone, password, passwordConfirm } = formData;

        if (!validateInfo(phone, password, passwordConfirm)) return;

        setIsLoading(true);

        try {
            if (mode === 'BORROW') {
                const result = await BorrowCheckController(phone, password);

                if (!result.valid) {
                    setError({ state: true, message: result.error });
                    setIsLoading(false);
                    return;
                }

                if (result.hasActiveLoan) {
                    setError({ state: true, message: result.message });
                    setIsLoading(false);
                    return;
                }

                setUserData({
                    user_id: result.user.user_id,
                    phone,
                    password
                });

                setStep(prev => (prev + 1));
            } else if (mode === 'RETURN' || mode === 'LOST_REPORT') {
                const user = await checkUserByTelAndPw(phone, password);

                if (!user) {
                    setError({ state: true, message: "사용자 정보가 일치하지 않습니다." });
                    setIsLoading(false);
                    return;
                }

                const umbrella = await checkBorrowedUmbrella(user.user_id);

                if (!umbrella) {
                    setError({ state: true, message: "대여 중인 우산이 없습니다." });
                    setIsLoading(false);
                    return;
                }

                setUserData({
                    user_id: user.user_id,
                    phone,
                    password
                });

                setUmbrellaData({
                    umbrella_id: umbrella.umbrella_id,
                    type: umbrella.umbrella_type,
                });

                setStep(prev => (prev + 1));
            }
        } catch (error) {
            console.error('사용자 정보 처리 오류:', error);
            setError({ state: true, message: "처리 중 오류가 발생했습니다." });
        } finally {
            setIsLoading(false);
        }
    };

    const dynamicText = mode === 'BORROW' ? "대여에 사용할" : "확인을 위한";

    return (
        <form className="neumorphism-container" onSubmit={handleSubmit}>
            <div className="neu-header-texts">
                <div className="neu-main-text">서비스 이용 정보를 입력해주세요.</div>
                <div className="neu-sub-text">{dynamicText} 전화번호와 PIN 번호를 입력해주세요.</div>
            </div>

            {error.state && <div className="neu-error-msg">{error.message}</div>}

            <div className="neu-input-container">
                <div className="neu-form-group">
                    <div className="neu-label-container">
                        <div className="neu-label-text">전화번호</div>
                        <img src={phoneImg} alt="전화번호" className="neu-asset-icon" />
                    </div>
                    <div className="user-neu-input-container">
                        <input
                            type="tel"
                            name="phone"
                            className="neu-input-box"
                            placeholder="전화번호 입력"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="neu-form-group">
                    <div className="neu-label-container">
                        <div className="neu-label-text">PIN 번호 4자리</div>
                        <img src={lockImg} alt="PIN 번호" className="neu-asset-icon" />
                    </div>
                    <div className="user-neu-input-container">
                        <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="off"
                            name="password"
                            className={formData.password ? "sec-pin pin-mask" : "sec-pin"}
                            placeholder="4자리 PIN"
                            value={formData.password}
                            onChange={handleChange}
                            maxLength="4"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {mode === 'BORROW' && (
                    <div className="neu-form-group">
                        <div className="neu-label-container">
                            <div className="neu-label-text">PIN 번호 확인</div>
                            <img src={keyImg} alt="PIN 번호 확인" className="neu-asset-icon" />
                        </div>
                        <div className="user-neu-input-container">
                            <input
                                type="text"
                                inputMode="numeric"
                                autoComplete="off"
                                name="passwordConfirm"
                                className={formData.passwordConfirm ? "sec-pin pin-mask" : "sec-pin"}
                                placeholder="PIN 다시 입력"
                                value={formData.passwordConfirm}
                                onChange={handleChange}
                                maxLength="4"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="neu-footer">
                <button type="button" className="neu-btn" onClick={() => setStep(prev => Math.max(prev - 1, 0))}>
                    이전
                </button>
                <button type="submit" className="neu-btn neu-btn-next" disabled={isLoading}>
                    {isLoading ? '조회 중...' : '다음'}
                </button>
            </div>
        </form>
    );
}
