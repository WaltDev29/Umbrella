import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RentalConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // UmbrellaSelectPage에서 전달받은 우산 종류
  const umbrellaType = location.state?.umbrellaType || '알 수 없음';

  // 더미 데이터
  const rentalDetails = {
    uniqueId: 'UMB-54321',
    dueDate: '2025-11-18',
  };

  const handleConfirm = () => {
    navigate('/complete', { state: { message: '대여가 완료되었습니다.' } });
  };

  return (
    <div>
      <h1>대여 정보 확인</h1>
      <p>우산 종류: {umbrellaType}</p>
      <p>고유 번호: {rentalDetails.uniqueId}</p>
      <p>반납 기한: {rentalDetails.dueDate}</p>
      <button onClick={handleConfirm}>대여하기</button>
    </div>
  );
}
