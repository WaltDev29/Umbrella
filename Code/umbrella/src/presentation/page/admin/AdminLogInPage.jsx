import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./AdminLoginPage.css";
import "./AdminCommon.css";
import AdminLayout from "../../component/admin/AdminLayout";
import styled from "styled-components";

const Card = styled.div`
    width: 100%;
    max-width: 700px;
    padding: 60px;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    text-align: center;

    @media screen and (min-width: 1024px) and (orientation: landscape) {
        max-width: 450px;
        padding: 40px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1); /* 그림자 더 깊게 */
    }
`;

const Title = styled.h1`
    margin: 0 0 50px 0;
    color: #333333;
    font-size: 40px;
    font-weight: bold;

    @media screen and (min-width: 1024px) and (orientation: landscape) {
        font-size: 28px;
        margin-bottom: 30px;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 30px;

    @media screen and (min-width: 1024px) and (orientation: landscape) {
        gap: 20px;
    }
`;

const Input = styled.input`
    width: 100%;
    height: 80px;
    padding: 0 20px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 28px;
    box-sizing: border-box;

    &:focus {
        outline: none;
        border-color: #007bff;
    }

    @media screen and (min-width: 1024px) and (orientation: landscape) {
        height: 50px;
        font-size: 16px;
        border-width: 1px;
    }
`;

// todo Submit Button 겹치는 것들 컴포넌트화 (UpdateUmbrellaInfo)
const Button = styled.button`
    width: 100%;
    height: 80px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 32px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #0056b3;
    }

    @media screen and (min-width: 1024px) and (orientation: landscape) {
        height: 50px;
        font-size: 18px;
    }
`;

const ErrorMessage = styled.div`
    margin-top: 20px;
    color: #dc3545;
    font-size: 24px;
    font-weight: bold;

    @media screen and (min-width: 1024px) and (orientation: landscape) {
        font-size: 16px;
    }
`;

function AdminLogInPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState();

    const adminPw = "1234";

    // todo 여기에 state 전달, 각 페이지 비정상 접속 차단 구현
    const handleSubmit = e => {
        e.preventDefault();

        if (password === adminPw) {
            setError("");
            navigate("/admin-home");
        } else setError("비밀번호가 올바르지 않습니다.");
    }

    return (
        <AdminLayout page="login">
            <Card>
                <Title>관리자 로그인</Title>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Button type="submit">
                        로그인
                    </Button>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Card>
        </AdminLayout>
    )
}

export default AdminLogInPage;