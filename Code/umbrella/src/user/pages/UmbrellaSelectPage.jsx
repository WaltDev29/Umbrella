import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UmbrellaSelectPage() {
  const navigate = useNavigate();

  const handleSelect = (umbrella) => {
    // 더미 데이터 (원래 RentalConfirmPage에 있던 데이터)
    const rentalDetails = {
      uniqueId: 'UMB-54321',
      dueDate: '2025-11-18',
    };

    console.log(`${umbrella} 선택됨`);
    // 선택한 우산 종류와 대여 정보를 state로 전달하며 정보 확인 페이지로 이동
    navigate('/rental-info', {
      state: {
        mode: 'RENTAL_CONFIRM',
        umbrellaType: umbrella,
        uniqueId: rentalDetails.uniqueId,
        dueDate: rentalDetails.dueDate,
      },
    });
  };

  return (
    <div>
      <h1>우산 선택</h1>
      <button onClick={() => handleSelect('장우산')}>장우산</button>
      <button onClick={() => handleSelect('단우산')}>단우산</button>
    </div>
  );
}
