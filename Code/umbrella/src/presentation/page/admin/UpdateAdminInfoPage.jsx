import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateManagerInfoController } from "../../../services/Controller";
import "./UpdateAdminInfoPage.css";
import styled from "styled-components"; // CSS 파일 import

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    //background-color: #f8f9fa;
`;

const Card = styled.div`
    width: 100%;
    max-width: 600px;
    background-color: #ffffff;
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    text-align: left;
`;

const Title = styled.h1`
    font-size: 40px;
    color: #0056b3;
    font-weight: 900;
    margin-bottom: 40px;
    text-align: center;
    border-bottom: 4px solid #ffc107;
    padding-bottom: 15px;
    display: block; /* 가운데 정렬을 위해 block 처리 */
`;

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

// todo Input 겹치는 것들 컴포넌트화 (AdminLogIn, UpdateAdminInfo)
const Input = styled.input`
    width: 100%;
    height: 60px;
    padding: 0 15px;
    font-size: 20px;
    border: 2px solid #ddd;
    border-radius: 8px;
    box-sizing: border-box; /* 패딩 포함 너비 계산 */
    
    &:focus {
        border-color: #0056b3;
        outline: none;
    }
`;

const BtnGroup = styled.div`
    display: flex;
    gap: 15px; /* 버튼 사이 간격 */
    margin-top: 40px;
`;

const Btn = styled.button`
    flex: 1; /* 너비 균등 분배 */
    height: 70px;
    font-size: 24px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: opacity 0.2s;
    
    &.submit {
        background-color: #0056b3; /* 메인 블루 */
        color: white;
    }

    &.cancel {
        background-color: #6c757d; /* 회색 (취소 의미) */
        color: white;
    }
    
    &:active {
        opacity: 0.8;
    }
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
        <Container>
            <Card>
                <Title>관리자 비밀번호 수정</Title>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <form onSubmit={handleSubmit}>
                    <Label>
                        기존 비밀번호
                        <Input type="password" onChange={e => setOriginalPw(e.target.value)} placeholder="기존 비밀번호 입력"/>
                    </Label>

                    <Label>
                        새 비밀번호
                        <Input type="password" onChange={e => setPw(e.target.value)} placeholder="새 비밀번호 입력"/>
                    </Label>

                    <Label>
                        비밀번호 확인
                        <Input type="password" onChange={e => setCheckPw(e.target.value)} placeholder="새 비밀번호 재입력"/>
                    </Label>
                    <BtnGroup>
                        <Btn type="submit" className="submit">비밀번호 변경</Btn>
                        <Btn type="button" onClick={() => navigate("/admin-home")} className="cancel">취소</Btn>
                    </BtnGroup>
                </form>
            </Card>
        </Container>
    )
}

export default UpdateAdminInfoPage;