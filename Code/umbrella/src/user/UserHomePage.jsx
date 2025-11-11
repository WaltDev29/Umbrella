import React, { useReducer } from 'react';
import { umbrellaReducer, initialState } from './UserPageLogic';
import { Header, Footer, ErrorDisplay, Buttons } from './components/Commonness';
import { UserInfo } from './components/UserInfo';
import { UmbrellaSelect } from './components/UmbrellaSelect';
import { ConfirmRental } from './components/ConfirmRental';
import { DefectReport } from './components/DefectReport';
import { Thanks } from './components/Thanks';

function UserHomePage() {
    const [state, dispatch] = useReducer(umbrellaReducer, initialState);

    const canGoBack = state.currentStep !== 'USER_HOME' && state.currentStep !== 'THANKS';

    const renderCurrentStep = () => {
        switch (state.currentStep) {
            case 'USER_HOME':
                return (
                    <div>
                        <ErrorDisplay message={state.error} />
                        <Buttons onClick={() => dispatch({ type: 'START_BORROW' })}>대여</Buttons>
                        <Buttons onClick={() => dispatch({ type: 'START_RETURN' })}>반납</Buttons>
                        <Buttons onClick={() => dispatch({ type: 'START_LOST_REPORT' })}>분실 신고</Buttons>
                        <Buttons onClick={() => dispatch({ type: 'START_DEFECT_REPORT' })}>고장 신고</Buttons>
                    </div>
                );

            case 'USER_INFO':
                const title = state.rentalMode === 'BORROW' ? '대여 사용자 정보 등록' :
                    state.rentalMode === 'RETURN' ? '반납 사용자 정보 입력' :
                        '분실 신고 사용자 정보 입력';
                return <UserInfo title={title} dispatch={dispatch} userInfo={state.userInfo} rentalMode={state.rentalMode} error={state.error} />;

            case 'UMBRELLA_SELECT':
                return <UmbrellaSelect dispatch={dispatch} state={state} />;

            case 'CONFIRM_RENTAL_MODAL':
                return <ConfirmRental dispatch={dispatch} state={state} />;

            case 'DEFECT_REPORT_INFO':
                return <DefectReport dispatch={dispatch} state={state} />;

            case 'THANKS':
                return <Thanks dispatch={dispatch} rentalMode={state.rentalMode} />;

            default:
                return null;
        }
    };

    return (
        <div>
            <div>
                {renderCurrentStep()}
            </div>

            {/* UserHomePage만의 푸터 */}
            <Footer dispatch={dispatch} canGoBack={canGoBack} />
        </div>
    );
}

export default UserHomePage;
