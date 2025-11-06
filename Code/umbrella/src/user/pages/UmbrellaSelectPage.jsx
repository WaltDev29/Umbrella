import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UmbrellaSelectPage() {
  const navigate = useNavigate();

  const handleSelect = (umbrella) => {
    console.log(`${umbrella} 선택됨`);
    // 선택한 우산 종류를 state로 전달하며 확인 페이지로 이동
    navigate('/rental-confirm', { state: { umbrellaType: umbrella } });
  };

  return (
    <div>
      <h1>우산 선택</h1>
      <button onClick={() => handleSelect('장우산')}>장우산</button>
      <button onClick={() => handleSelect('단우산')}>단우산</button>
    </div>
  );
}
