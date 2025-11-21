import React, {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";

export default function ReturnPage() {
    const navigate = useNavigate();     // todo 로직 끝나면 Thanks 페이지로 이동 시키기
    const location = useLocation();

    useEffect(() => {
        if (location.state?.mode !== "RETURN") navigate("/warning");
    }, [])

    // todo 여기에 UserInfo.jsx 컴포넌트 삽입
    return (
        <div>TEST</div>
    )

}