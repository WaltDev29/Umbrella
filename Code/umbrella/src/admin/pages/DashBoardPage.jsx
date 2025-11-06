import React from "react";
import {useLocation, useNavigate} from "react-router-dom";

function DashBoardPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const mode = location.state?.mode || "오류";
    const title = mode == "UMBRELLA" ? "우산 목록"
        : mode == "USER" ? "회원 목록"
            : "이용 기록"

    const handleUmbrellaEdit = mode => {
        navigate("/update-umbrella-info", {state : {mode : [mode]}});
    }

    return(
        <div>
            <h1>{title}</h1>
            {mode == "UMBRELLA" &&
                <div>
                    <button onClick={() => handleUmbrellaEdit("INSERT")}>우산 추가</button>
                    <button onClick={() => handleUmbrellaEdit("UPDATE")}>우산 상태 수정</button>
                    <button onClick={() => handleUmbrellaEdit("DELETE")}>우산 삭제</button>
                </div>
            }
            <div>
                <select name="ID" id="1">
                    <option value="a">1</option>
                    <option value="b">2</option>
                </select>
                <select name="ID" id="1">
                    <option value="a">1</option>
                    <option value="b">2</option>
                </select>
            </div>
        </div>
    )
}

export default DashBoardPage;