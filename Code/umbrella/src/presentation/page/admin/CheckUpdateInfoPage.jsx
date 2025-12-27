import React from "react";
import { useNavigate } from "react-router-dom";
import {updateUmbrellaStatusController, deleteUmbrellaController, addUmbrellaController} from "../../../services/Controller";
import "./CheckUpdateInfoPage.css";
import styled, {keyframes} from "styled-components";

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* 뒤 배경을 어둡게 처리 */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 제일 위에 뜨도록 설정 */
`;

const popIn = keyframes`
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
`;

const Wrapper = styled.div`
    background-color: white;
    padding: 40px;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    border: 1px solid #ddd;
    animation: ${popIn} 0.3s ease-out;
`;

const Title = styled.h1`
    font-size: 32px;
    color: #0056b3;
    font-weight: 900;
    margin-bottom: 10px;
    border-bottom: 4px solid #ffc107;
    display: inline-block;
    padding-bottom: 10px;
`;

const Question = styled.div`
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
    font-weight: bold;
`;

const SummaryBox = styled.div`
    background-color: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    margin: 20px 0 40px 0; /* 위아래 여백 */
    text-align: left; /* 정보는 왼쪽 정렬 */
`;

const InfoItem = styled.p`
    font-size: 20px;
    color: #555;
    margin: 10px 0;
    line-height: 1.5;
`;

const Strong = styled.strong`
    color: #0056b3;
    margin-right: 10px;
`;

const BtnGroup = styled.div`
    display: flex;
    gap: 15px;
`;

const Btn = styled.button`
    flex: 1;
    height: 60px;
    font-size: 22px;
    font-weight: bold;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &.confirm {
        background-color: #0056b3;
        color: white;
    }
    
    &.cancel {
        background-color: #6c757d;
        color: white;
    }
    
    &:active {
        opacity: 0.8;
    }
`;

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
        <Modal>
            <Wrapper>
                <Title>{title} 확인</Title>
                <Question>해당 우산을 {title} 하시겠습니까?</Question>

                <SummaryBox>
                    {mode !== "INSERT" && (
                        <InfoItem><Strong>우산 번호:</Strong> {id}</InfoItem>
                    )}

                    {mode === "INSERT" && (
                        <InfoItem><Strong>생성할 종류:</Strong> {size === "L" ? "장우산" : "단우산"}</InfoItem>
                    )}

                    {mode === "UPDATE" && (
                        <InfoItem><Strong>변경될 상태:</Strong> {status}</InfoItem>
                    )}
                </SummaryBox>

                <BtnGroup>
                    <Btn className="confirm" onClick={handleSubmit}>확인</Btn>
                    <Btn className="cancel" onClick={onCancel}>취소</Btn>
                </BtnGroup>
            </Wrapper>
        </Modal>
    )
}

export default CheckUpdateInfoPage;