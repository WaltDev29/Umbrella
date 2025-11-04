# ☔️ 우산 대여 서비스 프론트엔드 프로토타입 구현 (v4)

이 문서는 React와 `react-router-dom`을 사용하여 우산 대여 서비스의 사용자 흐름(User Flow) 프로토타입을 구축하는 절차를 정의합니다. 데이터베이스 없이 프론트엔드 로직만으로 구현하며, 페이지 이동 시 `state`를 넘겨 동적으로 컴포넌트를 렌더링하는 방법을 사용합니다.

---

## 0단계: 프로젝트 준비

프로젝트를 시작하고 필요한 라이브러리를 설치합니다.

1.  **React 앱 생성 및 `react-router-dom` 설치**
2.  **폴더 구조 생성**
    `src` 폴더 내에 다음과 같이 폴더와 파일을 미리 생성합니다.
    ```
    src/
    |-- User/           # 사용자 관련 페이지들을 모아둔 디렉토리
    |   |-- pages/      # 각 페이지 컴포넌트
    |       |-- HomePage.jsx
    |       |-- UserRegisterPage.jsx
    |       |-- UmbrellaSelectPage.jsx
    |       |-- RentalConfirmPage.jsx
    |       |-- ReportPage.jsx
    |       |-- ThankYouPage.jsx
    |-- Layout.jsx      # 공통 레이아웃 컴포넌트
    |-- Layout.css      # 공통 레이아웃 스타일
    |-- App.jsx         # 라우터 설정
    |-- index.js
    ```

---

## 1단계: 공통 레이아웃 (`Layout.jsx`, `Layout.css`) 구현

모든 페이지에 적용될 헤더(로고, 타이틀)와 푸터(홈, 뒤로가기 버튼)를 정의합니다.

```jsx
// src/Layout.jsx
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로가 홈 페이지인지 확인
  const isHomePage = location.pathname === '/';

  return (
    <div className="layout-container">
      <header className="app-header">
        <img src="/logo.png" alt="logo" className="app-logo" />
        <h1>우산 대여 시스템</h1>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <button onClick={() => navigate('/')}>홈</button>
        {/* 홈 페이지에서는 뒤로가기 버튼 비활성화 */}
        <button onClick={() => navigate(-1)} disabled={isHomePage}>뒤로가기</button>
      </footer>
    </div>
  );
}
```

```css
/* src/Layout.css */
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #ccc;
  background-color: #f8f9fa;
}

.app-logo {
  height: 40px;
  margin-right: 15px;
}

.app-main {
  flex-grow: 1;
  padding: 20px;
  height: 100%; /* 자식 요소가 높이를 채울 수 있도록 설정 */
}

.app-footer {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  border-top: 1px solid #ccc;
  background-color: #f8f9fa;
}
```

---

## 2단계: 라우터 설정 (`App.jsx`) 및 페이지 이동

`App.jsx`에서 `Layout` 컴포넌트를 사용하여 모든 페이지에 공통 레이아웃을 적용하고, 각 페이지의 URL 경로를 정의합니다. `HomePage`는 `Layout`의 `index` 라우트가 됩니다.

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from './User/pages/HomePage.jsx';
import UserRegisterPage from './User/pages/UserRegisterPage.jsx';
import UmbrellaSelectPage from './User/pages/UmbrellaSelectPage.jsx';
import RentalConfirmPage from './User/pages/RentalConfirmPage.jsx';
import ReportPage from './User/pages/ReportPage.jsx';
import ThankYouPage from './User/pages/ThankYouPage.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 모든 페이지에 Layout 적용 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* 홈 페이지 */}
          <Route path="user-register" element={<UserRegisterPage />} />
          <Route path="select" element={<UmbrellaSelectPage />} />
          <Route path="rental-confirm" element={<RentalConfirmPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="complete" element={<ThankYouPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
```

---

## 3단계: `HomePage` 구현

`HomePage`는 각기 다른 `state`를 전달하는 버튼들을 갖게 됩니다. `useNavigate` 훅을 사용하여 `UserRegisterPage`로 `mode` 값을 전달합니다.

```jsx
// src/User/pages/HomePage.jsx
// ... (이전 버전과 동일)
```

---

## 4단계: 동적 `UserRegisterPage` 구현

`UserRegisterPage`는 `HomePage`에서 받은 `mode` 값과 내부 로그인 상태(`isLoggedIn`)에 따라 완전히 다른 UI와 기능을 보여줍니다.

```jsx
// src/User/pages/UserRegisterPage.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const mode = location.state?.mode || 'RENTAL'; 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const mockRentalInfo = {
    umbrellaType: '장우산',
    uniqueId: 'UMB-12345',
    dueDate: '2025-11-11',
  };

  // 1. 대여 흐름 (mode === 'RENTAL')
  if (mode === 'RENTAL') {
    // ... (이전 버전과 동일)
  }

  // 2. 반납 또는 분실 신고 흐름
  const handleLogin = () => {
    console.log('사용자 로그인 성공');
    setIsLoggedIn(true);
  };

  const handleReturn = () => {
    navigate('/complete', { state: { message: '반납이 완료되었습니다.' } });
  };

  const handleLost = () => {
    navigate('/complete', { state: { message: '분실 신고가 완료되었습니다.' } });
  };

  // 로그인 상태와 모드에 따라 동적으로 제목 결정
  const title = !isLoggedIn
    ? '사용자 정보 입력'
    : mode === 'RETURN'
    ? '반납 요청'
    : '분실 신고';

  return (
    <div>
      <h1>{title}</h1>
      
      {!isLoggedIn ? (
        // 로그인 전
        <>
          <label>전화번호:</label> <input type="tel" />
          <br />
          <label>비밀번호:</label> <input type="password" />
          <br />
          <button onClick={handleLogin}>입력</button>
        </>
      ) : (
        // 로그인 후
        <>
          <h3>대여 정보</h3>
          <p>우산 종류: {mockRentalInfo.umbrellaType}</p>
          <p>고유 번호: {mockRentalInfo.uniqueId}</p>
          <p>반납 기한: {mockRentalInfo.dueDate}</p>
          
          {mode === 'RETURN' && <button onClick={handleReturn}>반납</button>}
          {mode === 'LOST' && <button onClick={handleLost}>분실 신고</button>}
        </>
      )}
    </div>
  );
}
```

---

## 5단계: `UmbrellaSelectPage` 구현

`UmbrellaSelectPage`에서 우산을 선택하면 `RentalConfirmPage`로 이동하며 선택한 우산 종류를 `state`로 전달합니다.

```jsx
// src/User/pages/UmbrellaSelectPage.jsx
// ... (이전 버전과 동일)
```

---

## 6단계: `RentalConfirmPage` 구현

`UmbrellaSelectPage`에서 선택한 우산 정보를 확인하고 최종 대여를 진행하는 페이지입니다.

```jsx
// src/User/pages/RentalConfirmPage.jsx
// ... (이전 버전과 동일)
```

---

## 7단계: `ReportPage` 구현

고장 신고를 처리하는 페이지입니다. 타이틀이 변경되었고, 고장 사유를 체크박스로 선택하는 기능이 추가되었습니다.

```jsx
// src/User/pages/ReportPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const reportReasons = [
  '우산 살 부러짐',
  '자동 기능 고장',
  '천 찢어짐',
  '손잡이 파손',
  '기타',
];

export default function ReportPage() {
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedItems({ ...checkedItems, [name]: checked });
  };

  const handleSubmit = () => {
    const selectedReasons = Object.keys(checkedItems).filter(
      (key) => checkedItems[key]
    );
    console.log('고장 신고 제출됨:', selectedReasons);
    navigate('/complete', { state: { message: '고장 신고가 접수되었습니다.' } });
  };

  return (
    <div>
      <h1>고장 신고</h1>
      <label>우산 번호:</label> <input type="text" />
      <br />
      <br />
      <label>고장 내용 (중복 선택 가능):</label>
      <div>
        {reportReasons.map((reason) => (
          <div key={reason}>
            <label>
              <input
                type="checkbox"
                name={reason}
                checked={checkedItems[reason] || false}
                onChange={handleCheckboxChange}
              />
              {reason}
            </label>
          </div>
        ))}
      </div>
      <br />
      <button onClick={handleSubmit}>제출</button>
    </div>
  );
}
```

---

## 8단계: `ThankYouPage` 구현

모든 작업 완료 후 사용자에게 감사 메시지를 표시하고, 5초 후 자동으로 홈으로 돌아가거나 화면 클릭 시 즉시 홈으로 돌아가는 페이지입니다.

```jsx
// src/User/pages/ThankYouPage.jsx
// ... (이전 버전과 동일)
```

---

## 9단계: 최종 흐름 테스트

모든 시나리오가 정상적으로 작동하는지 처음부터 끝까지 확인합니다.

> **✅ 9단계 (최종) Checkpoint:**
> 1.  **(대여)** 홈 -> 대여 -> 정보 입력 -> 등록 -> 우산 선택 -> 대여 정보 확인 -> 대여하기 -> 완료 페이지 (5초 카운트다운) -> 홈
> 2.  **(반납)** 홈 -> 반납 -> 정보 입력 -> 입력 -> **(타이틀: 반납 요청)** -> 반납 -> 완료 페이지 (5초 카운트다운) -> 홈
> 3.  **(분실)** 홈 -> 분실 신고 -> 정보 입력 -> 입력 -> **(타이틀: 분실 신고)** -> 분실 신고 -> 완료 페이지 (5초 카운트다운) -> 홈
> 4.  **(고장)** 홈 -> 고장 신고 -> **(타이틀: 고장 신고)** -> 우산 번호 입력 및 **체크박스 선택** -> 제출 -> 완료 페이지 (5초 카운트다운) -> 홈
>
> 위 4가지 시나리오가 모두 막힘없이 완료되면 프로토타입 구현이 성공적으로 완료된 것입니다.
