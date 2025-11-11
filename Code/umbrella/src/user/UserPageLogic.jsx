// =========================================================================
// 1. 더미 데이터
// =========================================================================
export const USERS = [
    { name: '김해민', phone: '01011112222', password: '3333' },
    { name: '김호석', phone: '01022223333', password: '4444' },
    { name: '도경진', phone: '01044445555', password: '6666' },
    { name: '유송우', phone: '01066667777', password: '8888' },
];

export const UMBRELLAS = [
    { id: 'U001', type: '장우산', status: '대여가능', currentUserPhone: null },
    { id: 'U002', type: '단우산', status: '대여가능', currentUserPhone: null },
    { id: 'U003', type: '장우산', status: '대여가능', currentUserPhone: null },
    { id: 'U004', type: '단우산', status: '대여중', currentUserPhone: '01011112222' },
    { id: 'U005', type: '장우산', status: '대여중', currentUserPhone: '01022223333' },
    { id: 'U006', type: '단우산', status: '고장', currentUserPhone: null },
    { id: 'U007', type: '장우산', status: '분실', currentUserPhone: '01044445555' },
];

// =========================================================================
// 2. Initial State
// =========================================================================
export const initialState = {
    currentStep: 'USER_HOME',
    stepHistory: ['USER_HOME'],  // 방문한 화면 히스토리
    userInfo: { phone: '', password: '', passwordConfirm: '' },
    selectedUmbrella: null,
    selectedUmbrellaID: null,
    rentalMode: null,
    reportInfo: { umbrellaID: '' },
    error: null,
};

// =========================================================================
// 3. 유틸 함수
// =========================================================================
export const getRandomAvailableUmbrella = (type) => {
    const availableUmbrellas = UMBRELLAS.filter(u =>
        u.type === (type === 'LONG' ? '장우산' : '단우산') && u.status === '대여가능'
    );
    if (availableUmbrellas.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * availableUmbrellas.length);
    return availableUmbrellas[randomIndex].id;
};

export const getPreviousStep = (history) => {
    if (history.length <= 1) return 'USER_HOME';
    return history[history.length - 2];
};

// =========================================================================
// 4. Reducer
// =========================================================================
export function umbrellaReducer(state, action) {
    switch (action.type) {
        // 1. 내비게이션 및 리셋
        case 'NAVIGATE':
            return {
                ...state,
                currentStep: action.payload,
                stepHistory: [...state.stepHistory, action.payload],
                error: null
            };

        case 'GO_BACK':
            const previousStep = getPreviousStep(state.stepHistory);
            return {
                ...state,
                currentStep: previousStep,
                stepHistory: state.stepHistory.slice(0, -1),
                error: null
            };

        case 'RESET':
            return { ...initialState, currentStep: 'USER_HOME', stepHistory: ['USER_HOME'] };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        // 2. 초기 모드 설정
        case 'START_BORROW':
            return {
                ...state,
                rentalMode: 'BORROW',
                currentStep: 'USER_INFO',
                stepHistory: [...state.stepHistory, 'USER_INFO'],
                error: null,
                userInfo: initialState.userInfo,
                selectedUmbrellaID: null
            };

        case 'START_RETURN':
            return {
                ...state,
                rentalMode: 'RETURN',
                currentStep: 'USER_INFO',
                stepHistory: [...state.stepHistory, 'USER_INFO'],
                error: null,
                userInfo: initialState.userInfo,
                selectedUmbrellaID: null
            };

        case 'START_LOST_REPORT':
            return {
                ...state,
                rentalMode: 'LOST_REPORT',
                currentStep: 'USER_INFO',
                stepHistory: [...state.stepHistory, 'USER_INFO'],
                error: null,
                userInfo: initialState.userInfo,
                selectedUmbrellaID: null
            };

        case 'START_DEFECT_REPORT':
            return {
                ...state,
                rentalMode: 'DEFECT_REPORT',
                currentStep: 'DEFECT_REPORT_INFO',
                stepHistory: [...state.stepHistory, 'DEFECT_REPORT_INFO'],
                error: null,
                reportInfo: initialState.reportInfo,
                selectedUmbrellaID: null
            };

        // 3. 사용자 정보 입력 단계
        case 'SET_USER_INFO':
            return { ...state, userInfo: action.payload };

        case 'USER_AUTH_SUCCESS':
            if (state.rentalMode === 'BORROW') {
                return {
                    ...state,
                    currentStep: 'UMBRELLA_SELECT',
                    stepHistory: [...state.stepHistory, 'UMBRELLA_SELECT'],
                    error: null
                };
            }
            return {
                ...state,
                currentStep: 'CONFIRM_RENTAL_MODAL',
                stepHistory: [...state.stepHistory, 'CONFIRM_RENTAL_MODAL'],
                error: null
            };

        // 4. 고장신고 상세 정보 입력 단계
        case 'SET_REPORT_INFO':
            return { ...state, reportInfo: action.payload };

        case 'CONFIRM_REPORT_SUCCESS':
            return {
                ...state,
                currentStep: 'THANKS',
                stepHistory: [...state.stepHistory, 'THANKS'],
                error: null
            };

        // 5. 우산 선택 및 확정
        case 'SELECT_UMBRELLA': {
            const selectedType = action.payload;
            let selectedID = null;

            if (state.rentalMode === 'BORROW') {
                selectedID = getRandomAvailableUmbrella(selectedType);
                if (!selectedID) {
                    return { ...state, error: '선택한 우산의 재고가 없습니다.' };
                }
            } else if (state.rentalMode === 'LOST_REPORT') {
                const userRented = UMBRELLAS.find(u => u.currentUserPhone === state.userInfo.phone && u.status === '대여중');
                selectedID = userRented ? userRented.id : null;
            }

            return {
                ...state,
                selectedUmbrella: selectedType,
                selectedUmbrellaID: selectedID,
                currentStep: 'CONFIRM_RENTAL_MODAL',
                stepHistory: [...state.stepHistory, 'CONFIRM_RENTAL_MODAL'],
                error: null,
            };
        }

        case 'CONFIRM_RENTAL_FINAL':
            return {
                ...state,
                currentStep: 'THANKS',
                stepHistory: [...state.stepHistory, 'THANKS'],
                error: null
            };

        default:
            return state;
    }
}