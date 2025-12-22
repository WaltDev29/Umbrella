import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLoginPage.css";
import "./AdminCommon.css";


function AdminLogInPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState();

    const adminPw = "1234";

    const handleSubmit = e => {
        e.preventDefault();

        if (password === adminPw) {
            setError("");
            navigate("/admin-home");
        }
        else setError("비밀번호가 올바르지 않습니다.");
    }

    return (
        <div className="admin-login-container admin-layout">
            <div className="login-card">
                <h1 className="login-title">관리자 로그인</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        onChange={e => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button type="submit" className="login-button">
                        로그인
                    </button>
                </form>
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    )
}

export default AdminLogInPage;