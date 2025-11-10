import React from "react";
import {useNavigate} from "react-router-dom";

function CheckUpdateInfoPage({title, onCancel}) {

    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/complete', { state: { message: `${title} 처리가 완료되었습니다.`, mode: "ADMIN"} });
    }

    return(
        <div>
            <h1>{title}</h1>
            <div>해당 우산을 {title} 하시겠습니까?</div>
            <div>
                <button onClick={handleSubmit}>확인</button>
                <button onClick={onCancel}>취소</button>
            </div>
        </div>
    )
}

export default CheckUpdateInfoPage;