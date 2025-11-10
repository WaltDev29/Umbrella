import React, { useReducer, useEffect } from 'react';
// Render.jsx에서 리듀서 로직과 초기 상태를 가져옵니다.
import { initialState, umbrellaReducer } from "./Render";
// Components.jsx에서 모든 하위 컴포넌트와 렌더러 함수를 가져옵니다.
import { Header, Footer, Render } from "./Components";

// 최상위 부모 컴포넌트
function HomePage() {
    const [state, dispatch] = useReducer(umbrellaReducer, initialState);

    return (
        <div>
            <Header />
            <div>
                {Render(state.currentStep, dispatch, state)}
            </div>
            <Footer dispatch={dispatch} />
        </div>
    );
}

export default HomePage;