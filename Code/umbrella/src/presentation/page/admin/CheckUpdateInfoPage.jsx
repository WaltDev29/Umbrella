import React from "react";
import { useNavigate } from "react-router-dom";
import {updateUmbrellaStatusController,
    deleteUmbrellaController,
    addUmbrellaController
} from "../../../repositories/Controller";

function CheckUpdateInfoPage({ title, onCancel, data }) {
    const navigate = useNavigate();

    // data = [umbrellaId, umbrellaStatus]
    const umbrellaId = data ? data[0] : null;
    const umbrellaStatus = data ? data[1] : null;

    const handleSubmit = async () => {
        if (title !== "등록" && !umbrellaId) {
            alert("업데이트할 우산 ID가 없습니다.");
            console.error("전달된 데이터:", data);
            return;
        }

        try {
            let result;

            if (title === "삭제") {
                console.log(`[삭제 요청] 우산 ID: ${umbrellaId}`);
                result = await deleteUmbrellaController(umbrellaId);
            } else {

                // 등록 or 수정할 때 필요한 상태값이 없으면
                if (!umbrellaStatus) {
                    alert(title+"할 상태값이 없습니다.");
                    return;
                }

                // 수정 로직 (상태값도 필요)
                // 수정인데 상태값이 없으면 방어
                if(title === "등록") {
                    result = await addUmbrellaController(umbrellaStatus);
                } else if(title === "상태 수정"){
                    result = await updateUmbrellaStatusController(umbrellaStatus, umbrellaId);
                }
            }

            // 3. 결과 처리 (공통)
            if (result.success) {
                navigate('/complete', {
                    state: {
                        message: `${title} 처리가 완료되었습니다.`,
                        mode: "ADMIN"
                    }
                });
            } else {
                alert("처리 실패: " + result.error);
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
                <p><strong>우산 번호:</strong> {umbrellaId}</p>

                {title === "상태 수정" && (
                    <p><strong>변경될 상태:</strong> {umbrellaStatus}</p>
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