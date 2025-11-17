import React, { useEffect } from 'react';
import { Buttons, ErrorDisplay } from './Commonness';

export function UmbrellaSelect({ dispatch, state }) {
    const [availableUmbrellas, setAvailableUmbrellas] = React.useState({
        L: [],
        S: []
    });
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        const fetchAvailableUmbrellas = async () => {
            setIsLoading(true);

            try {
                // DB에서 상태 'A' (대여가능)인 우산만 조회
                const response = await fetch('http://localhost:5000/api/umbrellas?status=A', {
                    method: 'GET'
                });

                if (!response.ok) {
                    dispatch({ type: 'SET_ERROR', payload: '우산 정보 조회 실패' });
                    setIsLoading(false);
                    return;
                }

                const umbrellas = await response.json();

                // 타입별로 분류 (L = 장우산, S = 단우산)
                const longUmbrellas = umbrellas.filter(u => u.umbrella_type === 'L');
                const shortUmbrellas = umbrellas.filter(u => u.umbrella_type === 'S');

                setAvailableUmbrellas({
                    L: longUmbrellas,
                    S: shortUmbrellas
                });

            } catch (error) {
                dispatch({ type: 'SET_ERROR', payload: '네트워크 오류' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailableUmbrellas();
    }, [dispatch]);

    const handleSelect = (type) => {
        const umbrellas = availableUmbrellas[type];

        // 대여가능 우산 확인
        if (umbrellas.length === 0) {
            dispatch({
                type: 'SET_ERROR',
                payload: `${type === 'L' ? '장' : '단'}우산이 모두 대여중입니다.`
            });
            return;
        }

        // 첫 번째 우산 선택
        const selectedUmbrella = umbrellas[0];

        dispatch({
            type: 'SELECT_UMBRELLA',
            payload: {
                type,
                umbrellaId: selectedUmbrella.umbrella_id,
                umbrellaData: selectedUmbrella
            }
        });

        // 확인 페이지로
        dispatch({ type: 'NAVIGATE', payload: 'CONFIRM' });
    };

    if (isLoading) {
        return <div className="loading">우산 정보를 불러오는 중...</div>;
    }

    return (
        <div className="umbrella-select">
            <h2>우산 종류 선택</h2>
            <ErrorDisplay message={state.error} />

            <div className="umbrella-options">
                {/* 장우산 버튼 */}
                <Buttons
                    onClick={() => handleSelect('L')}
                    disabled={availableUmbrellas.L.length === 0}
                    className={availableUmbrellas.L.length === 0 ? 'disabled' : ''}
                >
                    <div className="umbrella-button">
                        <div className="umbrella-type">장우산</div>
                        <div className="umbrella-count">
                            {availableUmbrellas.L.length}개 대여 가능
                        </div>
                    </div>
                </Buttons>

                {/* 단우산 버튼 */}
                <Buttons
                    onClick={() => handleSelect('S')}
                    disabled={availableUmbrellas.S.length === 0}
                    className={availableUmbrellas.S.length === 0 ? 'disabled' : ''}
                >
                    <div className="umbrella-button">
                        <div className="umbrella-type">단우산</div>
                        <div className="umbrella-count">
                            {availableUmbrellas.S.length}개 대여 가능
                        </div>
                    </div>
                </Buttons>
            </div>

            {/* 대여가능 우산이 없을 경우 */}
            {availableUmbrellas.L.length === 0 && availableUmbrellas.S.length === 0 && (
                <div className="no-umbrellas">
                    <p>죄송합니다. 현재 대여가능한 우산이 없습니다.</p>
                </div>
            )}
        </div>
    );
}
