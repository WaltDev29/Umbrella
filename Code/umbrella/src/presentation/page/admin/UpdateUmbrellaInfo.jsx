import React, { useState, useEffect } from "react"; // useEffect 추가
import { useLocation } from "react-router-dom";
import {addUmbrellaController} from "../../../repositories/Controller";
import CheckUpdateInfoPage from "./CheckUpdateInfoPage";

function UpdateUmbrellaInfo() {
    const [showConfirmModal, setShowConfirmModal] = useState(false); // state 이름 변경 (제안사항 반영)
    const location = useLocation();

    const mode = location.state?.mode || null;
    const item = location.state?.selectedItem || null;

    const [selectedSort, setSelectedSort] = useState("L");
    // item값이 없거나 유효하지 않으면 R로 처리
    const [selectedStatus, setSelectedStatus] = useState(item?.umbrella_status || "R");

    // checkUpdateInfo에 보낼 (수정할)상태값, 선택한 우산 id가 조합된 list
    const [selectedValue, setSelectedValue] = useState(null);

    const titleMap = { "INSERT": "등록", "UPDATE": "상태 수정", "DELETE": "삭제" };
    const sortMap = { "L": "장우산", "S": "단우산" };
    const statMap = { "R": "대여중", "B": "고장", "L": "분실", "A": "대여 가능" }; // DB 코드값 기준

    const title = titleMap[mode] || "ERROR";
    const itemSort = sortMap[item?.umbrella_type] || "ERROR";
    const itemStat = statMap[item?.umbrella_status] || "ERROR";

    const newItemId = "UMB-12346";


    const handleSortChange = (e) => {
        setSelectedSort(e.target.value); // 선택한 우산 종류 저장
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value); // 선택한 우산 상태 저장
    };

    const handleSubmit = e => {
        e.preventDefault();

        // 이제 여기서 '현재 선택된 값'을 확인할 수 있습니다!
        if (mode === "INSERT") {

            // insertController(selectedSort); // 나중에 이런 식으로 호출
            //addUmbrellaController
            const insertData = [0, selectedSort];
            setSelectedValue(insertData);
            console.log(`[등록 요청] 종류: `+setSelectedValue);
        } else if (mode === "UPDATE") {
            const updateData = [item.umbrella_id, selectedStatus];

            setSelectedValue(updateData);
        } else if(mode=="DELETE"){
            const deleteData = [item.umbrella_id, null];
            setSelectedValue(deleteData);
        }

        setShowConfirmModal(true);
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
    }

    return (
        <div>
            {!showConfirmModal &&
                <form onSubmit={handleSubmit}>
                    <h1>우산 {title}</h1>
                    <div>우산 번호 : {item?.umbrella_id || newItemId}</div>

                    {/* INSERT 모드: 우산 종류 선택 */}
                    {mode === "INSERT" &&
                        <div>
                            <span>우산 종류</span>
                            {/* 👇 value와 onChange를 연결해줍니다 */}
                            <select value={selectedSort} onChange={handleSortChange}>
                                <option value="L">장우산</option>
                                <option value="S">단우산</option>
                            </select>
                        </div>
                    }

                    {/* UPDATE 모드: 우산 상태 수정 */}
                    {mode === "UPDATE" &&
                        <div>
                            <div>우산 종류 : {itemSort}</div>
                            <span>우산 상태</span>
                            <select value={selectedStatus} onChange={handleStatusChange}>
                                <option value="A">대여 가능(반납)</option> {/* RENTAL -> A */}
                                <option value="B">고장</option>         {/* BROKEN -> B */}
                                <option value="L">분실</option>         {/* LOST -> L */}
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
            {showConfirmModal &&
                <CheckUpdateInfoPage title={title} onCancel={handleCancel} data={selectedValue}/>
            }
        </div>
    )
}

export default UpdateUmbrellaInfo;