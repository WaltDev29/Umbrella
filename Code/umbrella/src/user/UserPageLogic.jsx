// =========================================================================
// 1. Initial State (캐시 구조)
// =========================================================================
export const initialState = {
    currentStep: 'USER_HOME',
    stepHistory: ['USER_HOME'],

    // 캐시 데이터 (메모리에만 저장, DB 안 함)
    cache: {
        userInfo: {
            phone: '',
            password: '',
            user_id: null
        },
        rentalMode: null, // 'BORROW', 'RETURN', 'LOST_REPORT', 'DEFECT_REPORT'
        selectedUmbrellaID: null,
        selectedUmbrellaType: null, // 'L' or 'S'
        selectedUmbrellaData: null
    },

    error: null,
    isLoading: false
};

// =========================================================================
// 2. 유틸 함수
// =========================================================================
export const getPreviousStep = (history) => {
    if (history.length <= 1) return 'USER_HOME';
    return history[history.length - 2];
};

// =========================================================================
// 3. Reducer (DB 기반)
// =========================================================================
export function umbrellaReducer(state, action) {
    switch (action.type) {
        // ==================== 네비게이션 ====================
        case 'NAVIGATE':
            return {
                ...state,
                currentStep: action.payload,
                stepHistory: [...state.stepHistory, action.payload],
                error: null
            };

        case 'GO_BACK':
            const previousStep = getPreviousStep(state.stepHistory);
            const newHistory = state.stepHistory.slice(0, -1);

            // 홈으로 돌아가면 캐시 전체 초기화
            if (previousStep === 'USER_HOME') {
                return {
                    ...state,
                    currentStep: previousStep,
                    stepHistory: newHistory,
                    cache: initialState.cache,
                    error: null
                };
            }

            return {
                ...state,
                currentStep: previousStep,
                stepHistory: newHistory,
                error: null
            };

        case 'RESET':
            // 완료 또는 타임아웃 시 전체 초기화
            return initialState;

        case 'CANCEL_PROCESS':
            // 진행 중 취소 시
            return {
                ...state,
                cache: initialState.cache,
                currentStep: 'USER_HOME',
                stepHistory: ['USER_HOME'],
                error: null
            };

        // ==================== 캐시 업데이트 ====================
        case 'UPDATE_CACHE_USER_INFO':
            return {
                ...state,
                cache: {
                    ...state.cache,
                    userInfo: {
                        ...state.cache.userInfo,
                        ...action.payload
                    }
                },
                error: null
            };

        case 'SET_RENTAL_MODE':
            return {
                ...state,
                cache: {
                    ...state.cache,
                    rentalMode: action.payload
                }
            };

        case 'SELECT_UMBRELLA':
            return {
                ...state,
                cache: {
                    ...state.cache,
                    selectedUmbrellaID: action.payload.umbrellaId,
                    selectedUmbrellaType: action.payload.type,
                    selectedUmbrellaData: action.payload.umbrellaData
                },
                error: null
            };

        // ==================== 에러/로딩 ====================
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };

        // ==================== 시작 ====================
        case 'START_PROCESS':
            // DEFECT_REPORT는 바로 DEFECT_REPORT로
            if (action.payload === 'DEFECT_REPORT') {
                return {
                    ...state,
                    cache: {
                        ...initialState.cache,
                        rentalMode: action.payload
                    },
                    currentStep: 'DEFECT_REPORT',
                    stepHistory: [...state.stepHistory, 'DEFECT_REPORT'],
                    error: null
                };
            }

            // 다른 모드는 USER_INFO로
            return {
                ...state,
                cache: {
                    ...initialState.cache,
                    rentalMode: action.payload
                },
                currentStep: 'USER_INFO',
                stepHistory: [...state.stepHistory, 'USER_INFO'],
                error: null
            };

        default:
            return state;
    }
}
