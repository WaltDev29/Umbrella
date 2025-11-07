import React, {useState} from "react";
import {useLocation} from "react-router-dom";
import CheckUpdateInfoPage from "./CheckUpdateInfoPage";

function UpdateUmbrellaInfo() {
    const [state, setState] = useState(false);  // 모듈 컨트롤을 위한 state 이름 정해주세요. please.
    const location = useLocation();
    const mode = location.state?.mode || null;
    const item = location.state?.selectedItem || null;

    const title = mode == "INSERT" ? "등록" :
        mode == "UPDATE" ? "상태 변경" :
            mode == "DELETE" ? "삭제" : "ERROR"

    const itemSort = item?.sort == "L" ?
        "장우산" :
        item?.sort == "S" ?
            "단우산" : "ERROR";

    const itemStat = item?.stat == "R" ? "대여중" :
        item?.stat == "B" ? "고장" :
            item?.stat == "L" ? "분실" :
                "ERROR";

    const newItemId = "UMB-12346"

    const handleSubmit = e => {
        e.preventDefault();
        setState(true);
    }

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
                    {mode == "INSERT" &&
                        <div>
                            <span>우산 종류</span>
                            <select name="" id="">
                                <option value="L">장우산</option>
                                <option value="S">단우산</option>
                            </select>
                        </div>
                    }

                    {mode == "UPDATE" &&
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

                    {mode == "DELETE" &&
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