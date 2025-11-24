import React, {useEffect, useState, useMemo} from "react";
import {useLocation, useNavigate} from "react-router-dom";

// controller로부터 데이터를 불러오기 위한 함수들 import
import {getUmbrellaListController, getUserListController, getHistoryListController} from "../../../services/Controller";

function DashBoardPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const mode = location.state?.mode || "UMBRELLA";

    const sizeMap = { "L": "장우산", "S": "단우산" };
    const statMap = { "R": "대여중", "B": "고장", "L": "분실", "A": "대여 가능" };

    // 날짜 표기 변경 함수
    const formatDate = (dateString) => {
        if(dateString == null) {
            return "null";
        }
        return new Date(dateString).toLocaleString();
    }

    // mode 값에 따라 달라지는, 요소들(제목, 컬럼명 등)을 page_config에 정리
    const PAGE_CONFIG = {
        UMBRELLA: {
            title: "우산 목록",
            fetchFn: getUmbrellaListController,
            data: "umbrellas",
            id: "umbrella_id",
            columns: [
                { label: "우산 ID", key: "umbrella_id" },
                { label: "우산 종류", key: "umbrella_type", render: (val) => sizeMap[val] || val },
                { label: "우산 상태", key: "umbrella_status", render: (val) => statMap[val] || val },
                { label: "생성일시", key: "created_at", render: formatDate },
                { label: "최종수정일", key: "updated_at", render: formatDate }
            ]
        },
        USER: {
            title: "사용자 목록",
            fetchFn: getUserListController,
            data: "users",
            id: "user_id",
            columns: [
                { label: "사용자 ID", key: "user_id" },
                { label: "사용자 전화번호", key: "user_tel" },
                { label: "사용자 비밀번호", key: "user_pw" },
                { label: "생성일시", key: "created_at", render: formatDate }
            ]
        },
        LOG: {
            title: "이용 기록",
            fetchFn: getHistoryListController,
            data: "historys",
            id: "history_id",
            columns: [
                { label: "이용 기록 ID", key: "history_id" },
                { label: "이용 기록 유형", key: "history_type" },
                { label: "우산 ID", key: "umbrella_id" },
                { label: "사용자 ID", key: "user_id" },
                { label: "생성일시", key: "created_at", render: formatDate }
            ]
        }
    }

    const current_config = PAGE_CONFIG[mode];

    // 상태 관리용 state
    const [datas, setDatas] = useState([]); // mode에 따른 데이터 전반에 대한 정보 state
    const [selectedItem, setSelectedItem] = useState(null); // 선택한 데이터에 대한 정보 state.

    const [filterType, setFilterType] = useState("ALL"); // 우산 크기(L/S) 데이터 필터링에 사용될 state.
    const [filterStatus, setFilterStatus] = useState("ALL"); // 우산 유형 데이터 필터링에 사용될 state.

    const [isLoading, setIsLoading] = useState(false);
    const [sizeConfig, setSizeConfig] = useState({key: null, direction: "asc", column: ""}); // 데이터 정렬에 대한 state


    // mode 변경 후 재렌더링 시마다 상응하는 데이터 불러오기
    useEffect(() => {
        const fetchData = async() => {
            setIsLoading(true);
            try {
                const result = await current_config.fetchFn();
                if(result.success) {
                    setDatas(result[current_config.data]);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
            setIsLoading(false);
        };
        fetchData();
    }, [mode]);

    // 우산 정렬 및 필터링을 총괄하는 부분.
    // useMemo: useState가 매개변수 값 변경시마다 재렌더링 된다면, useMemo는 재렌더링 시 매개변수 값이 바뀌었을 경우에만 연산을 수행하며, 그대로일 경우 실행되지 않음.
    const processedData = useMemo(() => {
        if(!datas) return [];
        let result = [...datas] // data의 원본 내용만 복사한 복사본만 사용한다고 보면 됨

        // 우산 크기별 모아보기
        if(mode === "UMBRELLA" && filterType !== "ALL") {
            result = result.filter(item => item.umbrella_type === filterType);
        }

        if(mode === "UMBRELLA" && filterStatus !== "ALL") {
            result = result.filter(item => item.umbrella_status === filterStatus);
        }

        if(sizeConfig.key) {
            result.sort((a, b) => {
                const aValue = a[sizeConfig.key];
                const bValue = b[sizeConfig.key];

                if (aValue < bValue) return sizeConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sizeConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [datas, filterType, filterStatus, sizeConfig, mode]);



    const handleColClick = (column) => {
        let key;
        switch (column) {
            case "우산 ID": key = current_config.id; break;
            case "우산 종류": key = "umbrella_type"; break;
            case "우산 상태": key = "umbrella_status"; break;
            case "생성일시": key = "created_at"; break;
            case "최종수정일": key = "updated_at"; break;

            case "사용자 ID": key = "user_id"; break;
            case "사용자 전화번호": key = "user_tel"; break;

            case "이용 기록 ID": key = "history_id"; break;
            default: key = null;
        }

        if (!key) return;

        let direction = "asc";
        if (sizeConfig.key === key && sizeConfig.direction === "asc") {
            direction = "desc";
        }

        setSizeConfig({key, direction, column});
    };

    const handleUmbrellaEdit = targetMode => {
        if(targetMode !== "INSERT" && !selectedItem) {
            alert("목록에서 우산을 선택해주십시오.");
            return;
        }
        navigate("/update-umbrella-info", {
            state: { mode: targetMode, selectedItem: targetMode === "INSERT" ? null : selectedItem }
        });
    }

    return (
        <div>
            <h1>{current_config.title}</h1>

            {mode === "UMBRELLA" && (
                <div>
                    <button onClick={() => handleUmbrellaEdit("INSERT")}>우산 등록</button>
                    <button onClick={() => handleUmbrellaEdit("UPDATE")}>우산 상태 수정</button>
                    <button onClick={() => handleUmbrellaEdit("DELETE")}>우산 삭제</button>
                </div>
            )}

            {selectedItem && (
                <div style={{ padding: "10px", background: "#f0f0f0", margin: "10px 0" }}>
                    선택된 ID: <strong>{selectedItem[current_config.id]}</strong>
                </div>
            )}

            <div>
                <table>
                    <thead>
                    <tr>
                        {current_config.columns.map(column => (
                            <th key={column.label}>
                                {column.label === "우산 종류" ? (
                                    <select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="ALL">전체(종류)</option>
                                        <option value="L">L</option>
                                        <option value="S">S</option>
                                    </select>
                                ) : column.label === "우산 상태" ? (
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="ALL">전체(구분)</option>
                                        {Object.entries(statMap).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <button onClick={() => handleColClick(column.label)}>
                                        {column.label}
                                        {sizeConfig.column === column.label && (sizeConfig.direction === "asc" ? " ▲" : " ▼")}
                                    </button>
                                )}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {processedData.map((data, index) => (
                        <tr
                            key={data[current_config.id] || index}
                            onClick={() => setSelectedItem(data)}
                            style={{ background: selectedItem === data ? "#e6f7ff" : "white", cursor: "pointer" }}
                        >
                            {current_config.columns.map((col) => {
                                const value = data[col.key];
                                const displayValue = col.render ? col.render(value) : value;
                                return <td key={col.key}>{displayValue}</td>;
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DashBoardPage;