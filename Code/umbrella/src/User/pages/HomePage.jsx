import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>우산 대여 서비스</h1>
      {/* 각 버튼은 'mode'라는 state를 UserRegisterPage로 전달 */}
      <button onClick={() => navigate('/user-register', { state: { mode: 'RENTAL' } })}>대여</button>
      <br />
      <button onClick={() => navigate('/user-register', { state: { mode: 'RETURN' } })}>반납</button>
      <br />
      <button onClick={() => navigate('/user-register', { state: { mode: 'LOST' } })}>분실 신고</button>
      <br />
      <button onClick={() => navigate('/report')}>고장 신고</button>
    </div>
  );
}