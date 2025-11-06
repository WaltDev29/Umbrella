import React from "react";
import {useNavigate} from "react-router-dom";

function AdminLogInPage() {
    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();
        navigate("/admin-home");
    }

    return(
        <div>
            <h1>관리자 로그인</h1>
            <form onSubmit={handleSubmit}>
                <label>
                <input type="password" placeholder="비밀번호 입력"/>
                </label>
                <button type="submit">로그인</button>
            </form>
        </div>
    )
}

export default AdminLogInPage;