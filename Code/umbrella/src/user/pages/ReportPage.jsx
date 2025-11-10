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