import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import CheckUpdateInfoPage from "./CheckUpdateInfoPage";

function UpdateUmbrellaInfo() {
    const [state, setState] = useState(false);  // 모듈 컨트롤을 위한 state 이름 정해주세요. please.
    const location = useLocation();
    const mode = location.state?.mode || null;
    const item = location.state?.selectedItem || null;  // dashboard에서 선택한 우산 정보

    // 선택된 우산 정보 state에 따라 문자열 할당
    const titleMap = {
        "INSERT": "등록",
        "UPDATE": "상태 변경",
        "DELETE": "삭제"
    }
    const sortMap = {
        "L": "장우산",
        "S": "단우산"
    }
    const statMap = {
        "R": "대여중",
        "B": "고장",
        "L": "분실"
    }
    const title = titleMap[mode] || "ERROR"
    const itemSort = sortMap[item?.sort] || "ERROR"
    const itemStat = statMap[item?.stat] || "ERROR"


    const newItemId = "UMB-12346"


    const handleSubmit = e => {
        e.preventDefault();
        setState(true);
    }

    // CheckUpdateInfoPage 모듈에서 취소버튼 눌렀을 시 돌아오도록 하기 위한 함수
    const handleCancel = () => {
        setState(false)
    }

    // 이 안에 조건부 렌더링 되는 부분 컴포넌트로 분리하는 거 고려해주세요.
    return (
        <div>
            {!state &&
                <form onSubmit={handleSubmit}>
                    <h1>우산 {title}</h1>
                    <div>우산 번호 : {item?.id || newItemId}</div>
                    {mode === "INSERT" &&
                        <div>
                            <span>우산 종류</span>
                            <select name="" id="">
                                <option value="L">장우산</option>
                                <option value="S">단우산</option>
                            </select>
                        </div>
                    }

                    {mode === "UPDATE" &&
                        <div>
                            <div>우산 종류 : {itemSort}</div>
                            <span>우산 상태</span>
                            <select name="" id="">
                                <option value="RENTAL">대여</option>
                                <option value="BROKEN">고장</option>
                                <option value="LOST">분실</option>
                            </select>
                        </div>
                    }

                    {mode === "DELETE" &&
                        <div>
                            <div>우산 종류 : {itemSort}</div>
                            <div>우산 상태 : {itemStat}</div>
                        </div>
                    }

                    <button type="submit">{title}</button>

                </form>
            }
            {state &&
                <CheckUpdateInfoPage title={title} onCancel={handleCancel}/>
            }
        </div>
    )
}

export default UpdateUmbrellaInfo;