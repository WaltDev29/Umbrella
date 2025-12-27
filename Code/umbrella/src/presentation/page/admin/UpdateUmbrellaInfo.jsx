import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import CheckUpdateInfoPage from "./CheckUpdateInfoPage";
import "./UpdateUmbrellaInfo.css";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    /*background-color: #f8f9fa;*/
`;

const Form = styled.form`
    width: 100%;
    max-width: 600px;
    background-color: #ffffff;
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    border: 1px solid #eee;
`;

const Title = styled.h1`
    font-size: 40px;
    color: #0056b3; /* 메인 블루 */
    font-weight: 900;
    margin-bottom: 40px;
    padding-bottom: 15px;
    border-bottom: 4px solid #ffc107; /* 노란색 포인트 */
    display: inline-block;
`;

const InfoText = styled.div`
    font-size: 24px;
    color: #333;
    margin-bottom: 30px;
    font-weight: bold;
    text-align: left;
    padding: 15px;
    background-color: #f1f3f5;
    border-radius: 10px;
`;

const InputGroup = styled.div`
    margin-bottom: 30px;
    text-align: left;
`;

const InputLabel = styled.span`
    display: block;
    font-size: 22px;
    color: #0056b3;
    font-weight: bold;
    margin-bottom: 10px
`;

const Select = styled.select`
    width: 100%;
    height: 70px;
    font-size: 24px;
    padding: 0 20px;
    border: 2px solid #ddd;
    border-radius: 10px;
    background-color: white;
    cursor: pointer;
    color: #333;

    &:focus {
        border-color: #0056b3;
        outline: none;
    }
`;

const Btn = styled.button`
    width: 100%;
    height: 80px;
    background-color: #0056b3;
    color: white;
    font-size: 32px;
    font-weight: bold;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.2s;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    
    &:active {
        transform: scale(0.98);
    }
`;

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
        <Container>
            {!showConfirmModal &&
                <Form onSubmit={handleSubmit}>
                    <Title>우산 {title}</Title>
                    <InfoText>우산 번호 : {item?.umbrella_id || newItemId}</InfoText>

                    {/* INSERT 모드: 우산 종류 선택 */}
                    {mode === "INSERT" &&
                        <InputGroup>
                            <InputLabel>우산 종류</InputLabel>
                            {/* 👇 value와 onChange를 연결해줍니다 */}
                            <Select value={selectedSize} onChange={handleSizeChange}>
                                <option value="L">장우산</option>
                                <option value="S">단우산</option>
                            </Select>
                        </InputGroup>
                    }

                    {/* UPDATE 모드: 우산 상태 수정 */}
                    {mode === "UPDATE" &&
                        <InputGroup>
                            <InfoText style={{marginBottom: "20px"}}>우산 종류 : {itemSize}</InfoText>
                            <InputLabel>우산 상태 변경</InputLabel>
                            <Select value={selectedStatus} onChange={handleStatusChange}>
                                <option value="A">대여 가능(반납)</option> {/* RENTAL -> A */}
                                <option value="B">고장</option>         {/* BROKEN -> B */}
                                <option value="L">분실</option>         {/* LOST -> L */}
                            </Select>
                        </InputGroup>
                    }

                    {mode === "DELETE" &&
                        <InputGroup>
                            <InfoText>우산 종류 : {itemSize}</InfoText>
                            <InfoText>우산 상태 : {itemStat}</InfoText>
                        </InputGroup>
                    }

                    <Btn type="submit">{title}</Btn>
                </Form>
            }
            {showConfirmModal &&
                <CheckUpdateInfoPage title={title} mode={mode} onCancel={handleCancel} data={selectedValue}/>
            }
        </Container>
    )
}

export default UpdateUmbrellaInfo;