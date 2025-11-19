import React, { useState, useEffect } from "react"; // useEffect 추가
import { useLocation } from "react-router-dom";
import { updateUmbrellaStatusController } from "../../database/controller/Controller";
import CheckUpdateInfoPage from "./CheckUpdateInfoPage";

function UpdateUmbrellaInfo() {
    const [showConfirmModal, setShowConfirmModal] = useState(false); // state 이름 변경 (제안사항 반영)
    const location = useLocation();

    const mode = location.state?.mode || null;
    const item = location.state?.selectedItem || null;

    const [selectedSort, setSelectedSort] = useState("L");
    const [selectedStatus, setSelectedStatus] = useState(item?.umbrella_status || "R");

    // checkUpdateInfo에 보낼 (수정할)상태값, 선택한 우산 id가 조합된 list
    const [selectedValue, setSelectedValue] = useState(null);

    const titleMap = { "INSERT": "등록", "UPDATE": "상태 변경", "DELETE": "삭제" };
    const sortMap = { "L": "장우산", "S": "단우산" };
    const statMap = { "R": "대여중", "B": "고장", "L": "분실", "A": "대여 가능" }; // DB 코드값 기준

    const title = titleMap[mode] || "ERROR";
    const itemSort = sortMap[item?.umbrella_type] || "ERROR";
    const itemStat = statMap[item?.umbrella_status] || "ERROR";

    const newItemId = "UMB-12346";


    const handleSortChange = (e) => {
        setSelectedSort(e.target.value); // 선택한 우산 종류 저장
        console.log("선택된 종류:", e.target.value);
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value); // 선택한 우산 상태 저장
        console.log("선택된 상태:", e.target.value);
    };

    const handleSubmit = e => {
        e.preventDefault();

        // 이제 여기서 '현재 선택된 값'을 확인할 수 있습니다!
        if (mode === "INSERT") {
            console.log(`[등록 요청] 종류: ${selectedSort}`);
            // insertController(selectedSort); // 나중에 이런 식으로 호출
        } else if (mode === "UPDATE") {
            console.log(`[수정 요청] ID: ${item.umbrella_id}, 변경할 상태: ${selectedStatus}`);
            const updateData = [item.umbrella_id, selectedStatus];

            setSelectedValue(updateData);
            console.log("selectedValue "+updateData);
            //updateUmbrellaStatusController(selectedStatus, item.umbrella_id);
        } else if(mode=="DELETE"){
            const deleteData = [item.umbrella_id, null];
            setSelectedValue(deleteData);
            console.log("삭제 데이터 준비:", deleteData);
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

                    {/* UPDATE 모드: 우산 상태 변경 */}
                    {mode === "UPDATE" &&
                        <div>
                            <div>우산 종류 : {itemSort}</div>
                            <span>우산 상태</span>
                            {/* 👇 [중요] value를 statMap의 키값(R, B, L)과 통일했습니다.
                                이렇게 해야 DB에 저장할 때 변환 과정 없이 바로 보낼 수 있어요.
                            */}
                            <select value={selectedStatus} onChange={handleStatusChange}>
                                <option value="R">대여 가능(반납)</option> {/* RENTAL -> R */}
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