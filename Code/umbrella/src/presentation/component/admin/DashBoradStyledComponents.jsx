import styled from "styled-components";

export const SelectedItemBox = styled.div`
    background-color: #ffffff;
    border: 3px solid #0056b3;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 30px;
    font-size: 24px;
    color: #0056b3;
    text-align: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

export const TableWrapper = styled.div`
    overflow-x: auto;
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 22px;
`;

export const Tr = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }

    &.selected-row {
        background-color: #fff3cd;
        border-left: 8px solid #0056b3;
        font-weight: bold;
    }
`;

export const Th = styled.th`
    background-color: #0056b3;
    color: #ffffff;
    padding: 20px;
    text-align: center;
    font-weight: bold;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
`;

export const Select = styled.select`
    width: 100%;
    height: 70px;
    font-size: 20px;
    padding: 5px 10px;
    border-radius: 8px;
    border: none;
    background-color: #ffffff;
    color: #0056b3;
    font-weight: bold;
    cursor: pointer;
`;

export const SortBtn = styled.button`
    background: none;
    border: none;
    color: #ffffff;
    font-size: 22px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    width: 100%;
`;

export const Td = styled.td`
    padding: 25px 15px;
    text-align: center;
    border-bottom: 1px solid #eee;
    color: #333;
`;

export const StatusText = styled.span`
    font-weight: 800;

    /* --- 우산 상태(Umbrella Status) 컬러 --- */
    &.st-R {color: #0891b2;} /* 대여중 - 청록 */
    &.st-B {color: #dc2626;} /* 고장 - 빨강 */
    &.st-L {color: #d97706;} /* 분실 - 주황 */
    &.st-A {color: #059669;} /* 대여가능 - 초록 */
    
    /*  이용 기록(Log) 상태별 텍스트 컬러 */
    &.st-log-R {color: #059669;} /* 대여 (Rent) - 초록 */
    &.st-log-T {color: #0891b2;} /* 반납 (Turn-in) - 청록 */
    &.st-log-B {color: #dc2626;} /* 고장 (Broken) - 빨강 */
    &.st-log-L {color: #d97706;} /* 분실 (Lost) - 주황 */
`;
