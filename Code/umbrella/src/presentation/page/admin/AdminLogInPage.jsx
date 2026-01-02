import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

import AdminLayout from "../../component/admin/AdminLayout";
import SubmitBtn from "../../component/admin/SubmitBtn";
import AdminInput from "../../component/admin/AdminInput";
import Card from "../../component/admin/Card";

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
            navigate("/admin-home", {state: {valid : true}});
        } else setError("비밀번호가 올바르지 않습니다.");
    }

    return (
        <AdminLayout page="login">
            <Card className="admin-login">
                <Title>관리자 로그인</Title>
                <Form onSubmit={handleSubmit}>
                    <AdminInput
                        className="admin-login"
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        onChange={e => setPassword(e.target.value)}
                    />
                    <SubmitBtn className="admin-login">
                        로그인
                    </SubmitBtn>
                </Form>
                {error && <ErrorMessage>{error}</ErrorMessage>}
            </Card>
        </AdminLayout>
    )
}

export default AdminLogInPage;