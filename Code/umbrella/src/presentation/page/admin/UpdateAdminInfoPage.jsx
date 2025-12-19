import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import {updateManagerInfoView} from "../../database/view/ManagersView"; // 컨트롤러를 사용하므로 View는 직접 import 안 해도 됩니다.
import { updateManagerInfoController } from "../../../services/Controller";
import "./UpdateAdminInfoPage.css"; // CSS 파일 import

function UpdateAdminInfoPage() {
    const navigate = useNavigate();
    const [originalPw, setOriginalPw] = useState("");   // 사용자가 입력한 기존 비밀번호
    const [pw, setPw] = useState("");    // 새 비밀번호
    const [checkPw, setCheckPw] = useState("");     // 새 비밀번호 확인
    const [error, setError] = useState(""); // 에러 메시지

    // const password = "1234";    // (서버에서 검사하므로 이 부분은 제거)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // 에러 메시지 초기화

        // 1. 새 비밀번호 일치 여부 (클라이언트)
        if (pw !== checkPw) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        // 2. 서버로 전송 (API 호출)
        try {
            await updateManagerInfoController(originalPw, pw);

            navigate('/complete', { state: { message: '비밀번호 변경이 완료되었습니다.' } });

        } catch (err) {
            setError(err.message || "비밀번호 변경에 실패했습니다.");
        }
    }

    return (
        <div className="admin-update-container">
            <div className="admin-update-card">
                <h1 className="admin-title">관리자 비밀번호 수정</h1>
                {error && <h2 className="error-text">{error}</h2>}
                <form onSubmit={handleSubmit}>
                    <label className="form-label">
                        기존 비밀번호
                        <input type="password" onChange={e => setOriginalPw(e.target.value)} className="form-input" placeholder="기존 비밀번호 입력"/>
                    </label>

                    <label className="form-label">
                        새 비밀번호
                        <input type="password" onChange={e => setPw(e.target.value)} className="form-input" placeholder="새 비밀번호 입력"/>
                    </label>

                    <label className="form-label">
                        비밀번호 확인
                        <input type="password" onChange={e => setCheckPw(e.target.value)} className="form-input" placeholder="새 비밀번호 재입력"/>
                    </label>
                    <div className="btn-group">
                        <button type="submit" className="btn-action btn-submit">비밀번호 변경</button>
                        <button type="button" onClick={() => navigate("/admin-home")} className="btn-action btn-cancel">취소</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateAdminInfoPage;