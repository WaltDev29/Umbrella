import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function UpdateAdminInfoPage() {
    const [state, setState] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();
        navigate('/complete', { state: { message: '비밀번호 변경이 완료되었습니다.' } });
    }

    const handleCancel = () => {

    }

    return (
        <div>
            <h1>관리자 비밀번호 수정</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    기존 비밀번호 :
                    <input type="password"/>
                </label>
                <br/>
                <label>
                    새 비밀번호 :
                    <input type="password"/>
                </label>
                <br/>
                <label>
                    비밀번호 확인 :
                    <input type="password"/>
                </label>
                <div>
                    <button type="submit">비밀번호 변경</button>
                    <button type="button" onClick={() => navigate("/admin-home")}>취소</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateAdminInfoPage;