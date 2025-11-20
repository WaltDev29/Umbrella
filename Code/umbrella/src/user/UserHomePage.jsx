import React, { useReducer } from 'react';
import { umbrellaReducer, initialState } from './UserPageLogic';
import { UserInfo } from './components/UserInfo';
import { UmbrellaSelect } from './components/UmbrellaSelect';
import { DefectReport } from './components/DefectReport';
import { ConfirmRental } from './components/ConfirmRental';
import { Thanks } from './components/Thanks';

function UserHomePage() {
    const [state, dispatch] = useReducer(umbrellaReducer, initialState);

    const renderCurrentStep = () => {
        switch (state.currentStep) {
            case 'USER_HOME':
                return (
                    <div className="home-page">
                        <h1>우산 대여 시스템</h1>

                        {/* 4개 버튼 */}
                        <button onClick={() => dispatch({ type: 'START_PROCESS', payload: 'BORROW' })}>
                            우산 대여
                        </button>

                        <button onClick={() => dispatch({ type: 'START_PROCESS', payload: 'RETURN' })}>
                            우산 반납
                        </button>

                        <button onClick={() => dispatch({ type: 'START_PROCESS', payload: 'LOST_REPORT' })}>
                            분실 신고
                        </button>

                        <button onClick={() => dispatch({ type: 'START_PROCESS', payload: 'DEFECT_REPORT' })}>
                            고장 신고
                        </button>
                    </div>
                );

            case 'USER_INFO':
                return (
                    <UserInfo
                        dispatch={dispatch}
                        state={state}
                        rentalMode={state.cache.rentalMode}
                    />
                );

            case 'UMBRELLA_SELECT':
                return (
                    <UmbrellaSelect
                        dispatch={dispatch}
                        state={state}
                    />
                );

            case 'DEFECT_REPORT':
                return (
                    <DefectReport
                        dispatch={dispatch}
                        state={state}
                    />
                );

            case 'CONFIRM':
                return (
                    <ConfirmRental
                        dispatch={dispatch}
                        state={state}
                    />
                );

            case 'THANKS':
                return (
                    <Thanks
                        dispatch={dispatch}
                        rentalMode={state.cache.rentalMode}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="user-home-page">
            <main>
                {renderCurrentStep()}
            </main>

            {state.currentStep !== 'USER_HOME' && state.currentStep !== 'THANKS' && (
                <div className="nav-buttons">
                    <button onClick={() => dispatch({ type: 'GO_BACK' })}>← 뒤로</button>
                    <button onClick={() => dispatch({ type: 'CANCEL_PROCESS' })}>홈</button>
                </div>
            )}
        </div>
    );
}

export default UserHomePage;
