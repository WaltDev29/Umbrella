import React, { useState } from 'react';
import { defectReportUmbrella } from '../../../repositories/UmbrellaRepository';
import { useNavigate } from "react-router-dom";
import './UserInfo.css';
import phoneImg from '../../../assets/phone.png';
import keyImg from '../../../assets/key.png';

export default function DefectReport({ setIsDone }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        phone: '',
        umbrella_id: ''
    });

    const [error, setError] = useState({
        state: false,
        message: ""
    });

    const [isLoading, setIsloading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        const { phone, umbrella_id } = formData;

        if (!phone) {
            setError({ state: true, message: "전화번호를 입력해주세요." });
            return;
        }

        if (!umbrella_id) {
            setError({ state: true, message: "우산 번호를 입력해주세요." });
            return;
        }

        setIsloading(true);

        try {
            const normalizedPhone = phone.replace(/-/g, '');
            const response = await defectReportUmbrella(normalizedPhone, umbrella_id);
            const data = await response.json();

            if (!response.ok) {
                setError({ state: true, message: data.message || '고장 신고에 실패했습니다.' });
                return;
            }

            setIsDone(true);
        } catch (error) {
            console.error('고장 신고 오류:', error);
            setError({ state: true, message: "처리 중 오류가 발생했습니다." });
        } finally {
            setIsloading(false);
        }
    };

    return (
        <div className="neumorphism-container">
            <div className="neu-header-texts">
                <div className="neu-main-text">우산에 문제가 있나요?</div>
                <div className="neu-sub-text">고장 신고를 위해 정보를 입력해주세요.</div>
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
                            placeholder="전화번호 입력"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div className="neu-form-group">
                    <div className="neu-label-container">
                        <div className="neu-label-text">우산 번호</div>
                        <img src={keyImg} alt="우산 번호" className="neu-asset-icon" />
                    </div>
                    <div className="user-neu-input-container">
                        <input
                            type="number"
                            name="umbrella_id"
                            placeholder="고장난 우산 번호"
                            value={formData.umbrella_id}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </div>

            <div className="neu-footer">
                <button type="button" className="neu-btn" onClick={() => navigate(-1)} disabled={isLoading}>
                    이전
                </button>
                <button type="button" className="neu-btn neu-btn-next" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? '신고 중...' : '고장 신고'}
                </button>
            </div>
        </div>
    );
}
