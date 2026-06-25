import React, { useEffect, useState } from 'react';
import { getAvailableUmbrella } from "../../../repositories/UmbrellaRepository";
import './UmbrellaSelect.css';
import LongUmbrellaImg from '../../../assets/Long.png';
import ShortUmbrellaImg from '../../../assets/Short.png';

export function UmbrellaSelect({ setUmbrellaData, setStep }) {
    const [availableUmbrellas, setAvailableUmbrellas] = useState({
        L: [],
        S: []
    });

    const [selectedType, setSelectedType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState({
        state: false,
        message: ""
    });

    useEffect(() => {
        const fetchAvailableUmbrellas = async () => {
            setIsLoading(true);
            try {
                const response = await getAvailableUmbrella();
                if (!response.ok) {
                    setError({ state: true, message: "우산 정보 조회에 실패했습니다." });
                    return;
                }
                const umbrellas = await response.json();
                const longUmbrellas = umbrellas.filter(u => u.umbrella_type === 'L');
                const shortUmbrellas = umbrellas.filter(u => u.umbrella_type === 'S');
                setAvailableUmbrellas({
                    L: longUmbrellas,
                    S: shortUmbrellas
                });
            } catch (error) {
                setError({ state: true, message: "네트워크 오류가 발생했습니다." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchAvailableUmbrellas();
    }, []);

    const handleSelect = (type) => {
        const umbrellas = availableUmbrellas[type];
        if (umbrellas.length === 0) {
            setError({ state: true, message: `${type === 'L' ? '장우산' : '단우산'}은 모두 대여 중입니다.` });
            return;
        }
        setSelectedType(type);
        setUmbrellaData({
            umbrella_id: umbrellas[0].umbrella_id,
            type
        });
        setError({ state: false, message: "" });
    };

    const handleSubmit = () => {
        if (selectedType) setStep(prev => prev + 1);
        else setError({ state: true, message: "우산을 선택해주세요." });
    };

    if (isLoading) {
        return <div className="umbrella-select-container loading">우산 정보를 불러오는 중...</div>;
    }

    return (
        <div className="umbrella-select-container">
            <div className="neu-header-texts">
                <div className="neu-main-text">대여할 우산을 선택해주세요.</div>
                <div className="neu-sub-text">원하시는 종류의 우산 카드를 터치해주세요.</div>
            </div>

            <div className="umbrella-card-grid">
                <div
                    className={`umbrella-neu-card ${selectedType === 'L' ? 'selected' : ''} ${availableUmbrellas.L.length === 0 ? 'disabled' : ''}`}
                    onClick={() => handleSelect('L')}
                >
                    <div className="umbrella-info-section">
                        <div className="umbrella-type-label-wrapper">
                            <div className="umbrella-type-label">장우산</div>
                            <div className="umbrella-type-label-En">L</div>
                        </div>
                        <div className="umbrella-icon-wrapper">
                            <img src={LongUmbrellaImg} alt="장우산" className="umbrella-asset-img" />
                        </div>
                        <div className="umbrella-type-label-ko">대형</div>
                        <div className="umbrella-count-badge">
                            {availableUmbrellas.L.length}개 대여 가능
                        </div>
                    </div>
                </div>

                <div
                    className={`umbrella-neu-card ${selectedType === 'S' ? 'selected' : ''} ${availableUmbrellas.S.length === 0 ? 'disabled' : ''}`}
                    onClick={() => handleSelect('S')}
                >
                    <div className="umbrella-info-section">
                        <div className="umbrella-type-label-wrapper">
                            <div className="umbrella-type-label">단우산</div>
                            <div className="umbrella-type-label-En">S</div>
                        </div>
                        <div className="umbrella-icon-wrapper">
                            <img src={ShortUmbrellaImg} alt="단우산" className="umbrella-asset-img" />
                        </div>
                        <div className="umbrella-type-label-ko">소형</div>
                        <div className="umbrella-count-badge">
                            {availableUmbrellas.S.length}개 대여 가능
                        </div>
                    </div>
                </div>
            </div>

            {error.state && <div className="no-umbrella-msg">{error.message}</div>}

            <div className="neu-footer">
                <button type="button" className="neu-btn" onClick={() => setStep(prev => Math.max(prev - 1, 0))}>
                    이전
                </button>
                <button type="button" className="neu-btn neu-btn-next" onClick={handleSubmit}>
                    다음
                </button>
            </div>
        </div>
    );
}
