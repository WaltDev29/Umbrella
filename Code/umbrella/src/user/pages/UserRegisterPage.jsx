import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UserRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // mode: 'RENTAL', 'RETURN', 'LOST' 중 하나
  const mode = location.state?.mode || 'RENTAL';

  // 더미 데이터
  const mockRentalInfo = {
    umbrellaType: '장우산',
    uniqueId: 'UMB-12345',
    dueDate: '2025-11-11',
  };

  // 1. 대여 흐름 (mode === 'RENTAL')
  if (mode === 'RENTAL') {
    const handleRegister = () => {
      // 사용자 등록 처리 (가정)
      console.log('사용자 등록 성공');
      navigate('/select'); // 우산 선택 페이지로 이동
    };
    return (
      <div>
        <h1>사용자 정보 등록</h1>
        <label>전화번호:</label> <input type="tel" />
        <br />
        <label>비밀번호:</label> <input type="password" />
        <br />
        <label>비밀번호 확인:</label> <input type="password" />
        <br />
        <button onClick={handleRegister}>등록</button>
      </div>
    );
  }

  // 2. 반납 또는 분실 신고 흐름 (mode === 'RETURN' or 'LOST')
  const handleLogin = () => {
    // 로그인 성공 처리 (가정)
    console.log('사용자 로그인 성공');
    navigate('/rental-info', {
      state: {
        mode: mode, // 'RETURN' or 'LOST'
        umbrellaType: mockRentalInfo.umbrellaType,
        uniqueId: mockRentalInfo.uniqueId,
        dueDate: mockRentalInfo.dueDate,
      },
    });
  };

  const title = mode === 'RETURN' ? '반납 요청' : '분실 신고';

  return (
    <div>
      <h1>{title}</h1>

      {/* 로그인 전 */}
      <>
        <label>전화번호:</label> <input type="tel" />
        <br />
        <label>비밀번호:</label> <input type="password" />
        <br />
        <button onClick={handleLogin}>입력</button>
      </>
    </div>
  );
}