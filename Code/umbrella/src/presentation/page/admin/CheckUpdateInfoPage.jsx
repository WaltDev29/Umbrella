import React from "react";
import { useNavigate } from "react-router-dom";
import {updateUmbrellaStatusController,
    deleteUmbrellaController,
    addUmbrellaController
} from "../../../services/Controller";

function CheckUpdateInfoPage({ title, onCancel, data, mode }) {
    const navigate = useNavigate();

    // data = [umbrellaId, umbrellaStatus]
    const { id, size, status } = data || {};

    const handleSubmit = async () => {
        if (mode !== "INSERT" && !id) {
            alert("업데이트할 우산 ID가 없습니다.");
            console.error("전달된 데이터:", data);
            return;
        }

        try {
            let result;

            if (mode === "DELETE") {
                console.log(`[삭제 요청] 우산 ID: ${id}`);
                result = await deleteUmbrellaController(id);
            } else {
                if (mode === "INSERT") {
                    if (!size) {
                        alert("등록할 우산 종류가 없습니다.");
                        return;
                    }
                    result = await addUmbrellaController(size);
                } else if (mode === "UPDATE") {
                    if (!status) {
                        alert("수정할 상태값이 없습니다.");
                        return;
                    }
                    result = await updateUmbrellaStatusController(status, id);
                }
            }

            // 3. 결과 처리 (공통)
            if (result && result.success) {
                navigate('/complete', {
                    state: {
                        message: `${title} 처리가 완료되었습니다.`,
                        mode: "ADMIN"
                    }
                });
            } else {
                alert("처리 실패: " + (result?.error || "알 수 없는 오류"));
            }
        } catch (error) {
            console.error("처리 중 에러 발생:", error);
            alert("시스템 에러가 발생했습니다.");
        }
    }

    return (
        <div>
            <h1>{title}</h1>
            <div>해당 우산을 {title} 하시겠습니까?</div>

            <div style={{ margin: "20px 0", padding: "10px", border: "1px solid #ddd" }}>
                {mode !== "INSERT" && (
                    <p><strong>우산 번호:</strong> {id}</p>
                )}

                {mode === "INSERT" && (
                    <p><strong>생성할 종류:</strong> {size === "L" ? "장우산" : "단우산"}</p>
                )}

                {mode === "UPDATE" && (
                    <p><strong>변경될 상태:</strong> {status}</p>
                )}
            </div>

            <div>
                <button onClick={handleSubmit}>확인</button>
                <button onClick={onCancel}>취소</button>
            </div>
        </div>
    )
}

export default CheckUpdateInfoPage;