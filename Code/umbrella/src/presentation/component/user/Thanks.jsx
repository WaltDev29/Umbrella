import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";

export default function Thanks() {
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const modeMessage = {
        BORROW: '대여가',
        RETURN: '반납이',
        LOST_REPORT: '분실 신고가',
        DEFECT_REPORT: '고장 신고가'
    };

    const message = modeMessage[location.state?.mode];

    return (
        <div>
            <h1>{message} 완료되었습니다. 감사합니다.</h1>
            <p>10초 뒤 초기 화면으로 돌아갑니다.</p>
            <button onClick={() => navigate("/")}>처음으로</button>
        </div>
    );
}
