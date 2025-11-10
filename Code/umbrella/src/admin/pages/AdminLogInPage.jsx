import React, {useState} from "react";
import {useNavigate} from "react-router-dom";

function AdminLogInPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");   // 사용자가 입력한 패스워드
    const [error, setError] = useState();   // 에러 메시지

    const adminPw = "1234"; // 더미 패스워드

    // 제출이벤트
    const handleSubmit = e => {
        e.preventDefault();

        // 비밀번호 검사 (실제로는 DB랑 체크해주세요)
        if (password === adminPw) {
            setError("");
            navigate("/admin-home");
        }
        else setError("비밀번호가 올바르지 않습니다.");
    }

    return(
        <div>
            <h1>관리자 로그인</h1>
            <form onSubmit={handleSubmit}>
                <label>
                <input type="password" placeholder="비밀번호 입력" onChange={e => setPassword(e.target.value)}/>
                </label>
                <button type="submit">로그인</button>
            </form>
            {error && <div>{error}</div>}
        </div>
    )
}

export default AdminLogInPage;