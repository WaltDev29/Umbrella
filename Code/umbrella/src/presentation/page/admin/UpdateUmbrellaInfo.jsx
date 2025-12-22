import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CheckUpdateInfoPage from "./CheckUpdateInfoPage";
import "./UpdateUmbrellaInfo.css";

const titleMap = { "INSERT": "등록", "UPDATE": "상태 수정", "DELETE": "삭제" };
const sizeMap = { "L": "장우산", "S": "단우산" };
const statMap = { "R": "대여중", "B": "고장", "L": "분실", "A": "대여 가능" }; // DB 코드값 기준

function UpdateUmbrellaInfo() {
    const location = useLocation();

    const mode = location.state?.mode || null;
    const item = location.state?.selectedItem || null;

    const [showConfirmModal, setShowConfirmModal] = useState(false); // state 이름 변경 (제안사항 반영)
    const [selectedSize, setSelectedSize] = useState("L");
    // item값이 없거나 유효하지 않으면 R로 처리
    const [selectedStatus, setSelectedStatus] = useState(item?.umbrella_status || "R");

    // checkUpdateInfo에 보낼 (수정할)상태값, 선택한 우산 id가 조합된 list
    const [selectedValue, setSelectedValue] = useState(null);

    const title = titleMap[mode] || "ERROR";
    const itemSize = sizeMap[item?.umbrella_type] || "ERROR";
    const itemStat = statMap[item?.umbrella_status] || "ERROR";

    const newItemId = "UMB-12346";

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value); // 선택한 우산 종류 저장
    };

    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value); // 선택한 우산 상태 저장
    };

    const handleSubmit = e => {
        // 기본적으로 리액트 페이지는 submit 액션이 돌아가면 페이지를 재렌더링 하는데, 이를 막기 위해 사용함.
        e.preventDefault();

        // checkUpdateInfo로 보내지는 데이터 묶음
        const submitData = {
            id: item?.umbrella_id || 0, // ID는 공통적으로 필요해서 기본값으로 정의.
            size: null,
            status: null
        }

        // mode에 따라 서로 다른 동작을 호출.
        if (mode === "INSERT") {
            submitData.id = 0;
            submitData.size = selectedSize;
            console.log(`[등록 요청] 종류: `, submitData);
        } else if (mode === "UPDATE") {
            submitData.status = selectedStatus;
        } else if(mode=="DELETE"){
            // DELETE는 ID값만 있어도 됨.
        }
        setSelectedValue(submitData);
        setShowConfirmModal(true);
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
    }

    return (
        <div className="update-container">
            {!showConfirmModal &&
                <form onSubmit={handleSubmit} className="update-card">
                    <h1 className="page-title">우산 {title}</h1>
                    <div className="info-text">우산 번호 : {item?.umbrella_id || newItemId}</div>

                    {/* INSERT 모드: 우산 종류 선택 */}
                    {mode === "INSERT" &&
                        <div className="input-group">
                            <span className="input-label">우산 종류</span>
                            {/* 👇 value와 onChange를 연결해줍니다 */}
                            <select value={selectedSize} onChange={handleSizeChange} className="kiosk-select">
                                <option value="L">장우산</option>
                                <option value="S">단우산</option>
                            </select>
                        </div>
                    }

                    {/* UPDATE 모드: 우산 상태 수정 */}
                    {mode === "UPDATE" &&
                        <div className="input-group">
                            <div className="info-text" style={{marginBottom: "20px"}}>우산 종류 : {itemSize}</div>
                            <span className="input-label">우산 상태 변경</span>
                            <select value={selectedStatus} onChange={handleStatusChange} className="kiosk-select">
                                <option value="A">대여 가능(반납)</option> {/* RENTAL -> A */}
                                <option value="B">고장</option>         {/* BROKEN -> B */}
                                <option value="L">분실</option>         {/* LOST -> L */}
                            </select>
                        </div>
                    }

                    {mode === "DELETE" &&
                        <div className="input-group">
                            <div className="info-text">우산 종류 : {itemSize}</div>
                            <div className="info-text">우산 상태 : {itemStat}</div>
                        </div>
                    }

                    <button type="submit" className="submit-btn">{title}</button>

                </form>
            }
            {showConfirmModal &&
                <CheckUpdateInfoPage title={title} mode={mode} onCancel={handleCancel} data={selectedValue}/>
            }
        </div>
    )
}

export default UpdateUmbrellaInfo;