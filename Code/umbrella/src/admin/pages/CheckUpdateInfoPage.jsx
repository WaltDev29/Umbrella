import React from "react";
import { useNavigate } from "react-router-dom";
import { updateUmbrellaStatusController, deleteUmbrellaController } from "../../database/controller/Controller";

function CheckUpdateInfoPage({ title, onCancel, data }) {
    const navigate = useNavigate();

    // data = [umbrellaId, umbrellaStatus]
    const umbrellaId = data ? data[0] : null;
    const umbrellaStatus = data ? data[1] : null;

    const handleSubmit = async () => {
        // 1. 유효성 검사: ID는 무조건 있어야 함
        if (!umbrellaId) {
            alert("업데이트할 우산 ID가 없습니다.");
            console.error("전달된 데이터:", data);
            return;
        }

        try {
            let result;

            // 2. ✨ [로직 추가] 삭제인지 수정인지 구분하여 컨트롤러 호출
            if (title === "삭제") {
                // 삭제 로직 (ID만 필요)
                console.log(`[삭제 요청] 우산 ID: ${umbrellaId}`);
                result = await deleteUmbrellaController(umbrellaId);
            } else {
                // 수정 로직 (상태값도 필요)
                // 수정인데 상태값이 없으면 방어
                if (!umbrellaStatus) {
                    alert("변경할 상태값이 없습니다.");
                    return;
                }
                console.log(`[수정 요청] 우산 ID: ${umbrellaId}, 상태: ${umbrellaStatus}`);
                result = await updateUmbrellaStatusController(umbrellaStatus, umbrellaId);
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

                {/* ✨ [UI 수정] '삭제'가 아닐 때만 상태 변경 텍스트를 보여줍니다. */}
                {title !== "삭제" && (
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