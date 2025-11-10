import React from 'react';
// Render.jsx에서 로직 수행에 필요한 데이터와 함수를 가져옵니다.
import { USERS, UMBRELLAS, getRandomAvailableUmbrella, umbrellaReducer } from "./Render";

// =========================================================================
// 3. 컴포넌트 정의
// =========================================================================

// 헤더
export function Header() {
    return (
        <div>
            <h1>우산 대여 시스템</h1>
        </div>
    );
}

// 푸터
export function Footer({ dispatch }) {
    return (
        <div>
            <Buttons onClick={() => dispatch({ type: 'NAVIGATE', payload: 'USER_HOME' })}>이전</Buttons>
            <Buttons onClick={() => dispatch({ type: 'RESET' })}>홈</Buttons>
        </div>
    );
}

// 버튼 (HomePage에서 Named Export로 가져오기 위해 export를 붙입니다)
export function Buttons(props) {
    return (
        <button onClick={props.onClick} disabled={props.disabled}>
            {props.children}
        </button>
    );
}

// 오류 메시지 (HomePage에서 Named Export로 가져오기 위해 export를 붙입니다)
export function ErrorDisplay({ message }) {
    if (!message) return null;
    return (
        <div>
            <p>{message}</p>
        </div>
    );
}

// 2-1. 사용자 홈 (UserHome)
export function UserHome({ dispatch, error }) {
    return (
        <div>
            <ErrorDisplay message={error} />
            <Buttons onClick={() => dispatch({ type: 'START_BORROW' })}>대여</Buttons>
            <Buttons onClick={() => dispatch({ type: 'START_RETURN' })}>반납</Buttons>
            <Buttons onClick={() => dispatch({ type: 'START_LOST_REPORT' })}>분실 신고</Buttons>
            <Buttons onClick={() => dispatch({ type: 'START_DEFECT_REPORT' })}>고장 신고</Buttons>
        </div>
    );
}

// 2-2/2-3/2-4. 사용자 정보 등록/입력 (UserInfo) - 대여/반납/분실 공통
export function UserInfo({ title, dispatch, userInfo, rentalMode, error }) {
    const [formData, setFormData] = React.useState(userInfo);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { phone, password, passwordConfirm } = formData;

        // 1. 예외 처리: 입력 누락 확인
        if (!phone || !password) {
            dispatch({ type: 'SET_ERROR', payload: '모든 정보를 입력해주세요.' });
            return;
        }

        // 2. 예외 처리: 비밀번호 확인 일치 검사
        if (rentalMode === 'BORROW' && password !== passwordConfirm) {
            dispatch({ type: 'SET_ERROR', payload: '일회용 비밀번호가 일치하지 않습니다. 다시 입력해주세요.' });
            return;
        }

        // 3. 더미 데이터 기반 인증 로직
        const authenticatedUser = USERS.find(user =>
            user.phone === phone && user.password === password
        );

        if (!authenticatedUser) {
            dispatch({ type: 'SET_ERROR', payload: '일치하는 사용자 정보가 없습니다. 다시 입력해주세요.' });
            return;
        }

        // 4. 반납/분실 신고 모드 추가 검사: 대여 중인 우산이 있는지 확인
        if (rentalMode === 'RETURN' || rentalMode === 'LOST_REPORT') {
            const hasRentedUmbrella = UMBRELLAS.some(u =>
                u.currentUserPhone === phone && u.status === '대여중'
            );

            if (!hasRentedUmbrella) {
                dispatch({ type: 'SET_ERROR', payload: '고객님 명의로 현재 대여 중인 우산이 없습니다.' });
                return;
            }
        }

        // 5. 인증 성공 및 상태 저장
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

// 2-2. 우산 종류 선택 페이지 (UmbrellaSelect)
export function UmbrellaSelect({ dispatch, state }) {
    // UMBRELLAS 데이터의 status가 '대여가능'인 우산만 카운트
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

// 대여/반납/분실신고 우산 정보 표시 (ConfirmRentalModal)
export function ConfirmRentalModal({ dispatch, state }) {
    const { rentalMode, selectedUmbrella, selectedUmbrellaID, userInfo } = state;

    const userUmbrella = UMBRELLAS.find(u => u.currentUserPhone === userInfo.phone && u.status === '대여중');

    const titleMap = { BORROW: '대여 정보 확정', RETURN: '반납 정보 확인', LOST_REPORT: '분실 신고 확정' };
    const confirmText = { BORROW: '대여 실행', RETURN: '반납 완료', LOST_REPORT: '분실 신고' };

    if ((rentalMode === 'RETURN' || rentalMode === 'LOST_REPORT') && !userUmbrella) {
        return (
            <div>
                <ErrorDisplay message="고객님께서 대여 중인 우산 정보가 없습니다." />
                <Buttons onClick={() => dispatch({ type: 'NAVIGATE', payload: 'USER_HOME' })}>홈으로</Buttons>
            </div>
        );
    }

    // 대여 모드에서 ID가 누락된 경우
    const displayUmbrellaID = selectedUmbrellaID || 'ID 확인 불가';
    const isBorrowError = rentalMode === 'BORROW' && !selectedUmbrellaID;


    const handleConfirm = () => {
        if (isBorrowError) {
            dispatch({ type: 'SET_ERROR', payload: '오류가 발생했습니다. 다시 시도해 주세요.' });
            return;
        }
        console.log(`[${confirmText[rentalMode]}] 성공적으로 처리되었습니다. 우산 ID: ${displayUmbrellaID}`);
        dispatch({ type: 'CONFIRM_RENTAL_FINAL' });
    }


    return (
        <div>
            <h2>{titleMap[rentalMode]}</h2>
            <ErrorDisplay message={state.error} />

            {/* 대여 모드: 확정된 랜덤 우산 ID 표시 */}
            {rentalMode === 'BORROW' && (
                <div>
                    <h3>대여하실 우산 정보</h3>
                    <p>우산 종류: {selectedUmbrella === 'LONG' ? '장우산' : '단우산'}</p>
                    <p>우산 고유 번호: {displayUmbrellaID}</p>
                    <p>우산 보관함에서 {displayUmbrellaID} 번호의 우산을 찾아 대여해주세요.</p>
                </div>
            )}

            {/* 반납/분실 모드: 대여 중인 우산 정보를 표시 */}
            {(rentalMode === 'RETURN' || rentalMode === 'LOST_REPORT') && (
                <div>
                    <h3>고객님이 대여하신 우산</h3>
                    <p>우산 번호: {userUmbrella?.id || '없음'}</p>
                    <p>우산 종류: {userUmbrella?.type}</p>
                    <p>반납 기한: (더미데이터에 없음)</p>
                </div>
            )}

            <p>전화번호: {userInfo.phone}</p>
            <Buttons onClick={handleConfirm} disabled={isBorrowError}>
                {confirmText[rentalMode]}
            </Buttons>
        </div>
    );
}

// 2-5. 고장 신고 정보 입력 페이지 (DefectReport)
export function DefectReport({ dispatch, state }) {
    const [formData, setFormData] = React.useState(state.reportInfo);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { umbrellaID } = formData;

        // 1. 우산 고유 번호 유효성 확인
        const umbrellaExists = UMBRELLAS.some(u => u.id === umbrellaID);

        if (!umbrellaExists) {
            dispatch({ type: 'SET_ERROR', payload: '존재하지 않는 우산 번호입니다.' });
            return;
        }

        // 2. 신고 성공 및 상태 저장
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

// 감사합니다 페이지 (Thanks)
export function Thanks({ dispatch }) {
    // 1. useEffect 훅을 사용하여 10초 타이머 설정
    React.useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({ type: 'RESET' }); // 10초 후 'RESET' 액션 실행
        }, 10000); // 10000ms = 10초

        // 2. 사용자가 버튼을 먼저 눌러 화면이 바뀌면 타이머 정리
        return () => clearTimeout(timer);
    }, [dispatch]);

    return (
        <div>
            <h1>감사합니다</h1>
            <p>처리가 완료되었습니다. 10초 뒤 초기 화면으로 돌아갑니다.</p>
            <Buttons onClick={() => dispatch({ type: 'RESET' })}>처음으로</Buttons>
        </div>
    );
}


// 화면 렌더러
export function Render(viewName, dispatch, state) {
    switch (viewName) {
        case 'USER_HOME':
            return <UserHome dispatch={dispatch} error={state.error} />;
        case 'USER_INFO':
            const title = state.rentalMode === 'BORROW' ? '대여 사용자 정보 등록' :
                state.rentalMode === 'RETURN' ? '반납 사용자 정보 입력' :
                    '분실 신고 사용자 정보 입력';
            return <UserInfo title={title} dispatch={dispatch} userInfo={state.userInfo} rentalMode={state.rentalMode} error={state.error} />;
        case 'DEFECT_REPORT_INFO':
            return <DefectReport dispatch={dispatch} state={state} />;
        case 'UMBRELLA_SELECT':
            return <UmbrellaSelect dispatch={dispatch} state={state} />;
        case 'CONFIRM_RENTAL_MODAL':
            return <ConfirmRentalModal dispatch={dispatch} state={state} />;
        case 'THANKS':
            return <Thanks dispatch={dispatch} />;
        default:
            return <UserHome dispatch={dispatch} />;
    }
}