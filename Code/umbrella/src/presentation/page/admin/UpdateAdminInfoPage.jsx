import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateManagerInfoController } from "../../../services/Controller";
import styled from "styled-components";

import ConfirmCancelBtn from "../../component/admin/ConfirmCancelBtn";
import Title from "../../component/admin/Title";
import AdminInput from "../../component/admin/AdminInput";
import AdminLayout from "../../component/admin/AdminLayout";
import Card from "../../component/admin/Card"; // CSS 파일 import

const ErrorMessage = styled.h2`
    color: #dc3545;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
    background-color: #fff5f5;
    padding: 10px;
    border-radius: 8px;
`;

const Label = styled.label`
    display: block;
    font-size: 22px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    margin-top: 20px;
`;

const BtnGroup = styled.div`
    display: flex;
    gap: 15px; /* 버튼 사이 간격 */
    margin-top: 40px;
`;

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
        <AdminLayout page="update-admin-info">
            <Card className="update-admin-info">
                <Title className="update-admin-info">관리자 비밀번호 수정</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <form onSubmit={handleSubmit}>
                    <Label>
                        기존 비밀번호
                        <AdminInput className="update-admin-info" type="password" onChange={e => setOriginalPw(e.target.value)} placeholder="기존 비밀번호 입력"/>
                    </Label>

                    <Label>
                        새 비밀번호
                        <AdminInput className="update-admin-info" type="password" onChange={e => setPw(e.target.value)} placeholder="새 비밀번호 입력"/>
                    </Label>

                    <Label>
                        비밀번호 확인
                        <AdminInput className="update-admin-info" type="password" onChange={e => setCheckPw(e.target.value)} placeholder="새 비밀번호 재입력"/>
                    </Label>
                    <BtnGroup>
                        <ConfirmCancelBtn type="submit" className="update-admin-info" sort="confirm">비밀번호 변경</ConfirmCancelBtn>
                        <ConfirmCancelBtn type="button" className="update-admin-info" sort="cancel" onClick={() => navigate("/admin-home")}>취소</ConfirmCancelBtn>
                    </BtnGroup>
                </form>
            </Card>
        </AdminLayout>
    )
}

export default UpdateAdminInfoPage;