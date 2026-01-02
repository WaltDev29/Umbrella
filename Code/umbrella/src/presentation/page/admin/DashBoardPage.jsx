import React, {useEffect, useState, useMemo} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {getUmbrellaListController, getUserListController, getHistoryListController} from "../../../services/Controller";
import styled from "styled-components";
import {SelectedItemBox, TableWrapper, Table, Tr, Th, Select, SortBtn, Td, StatusText} from "../../component/admin/DashBoradStyledComponents"

import AdminLayout from "../../component/admin/AdminLayout";
import DashboardBtn from "../../component/admin/DashboardBtn";
import Title from "../../component/admin/Title";

// todo 이거 컴포넌트화 (UpdateAdminInfo, CheckUpdateInfoPage)
const BtnGroup = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
`;

function DashBoardPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const mode = location.state?.mode || "UMBRELLA";

    const sizeMap = {"L": "장우산", "S": "단우산"};

    // DB 코드값 기준 매핑
    const statMap_umb = {"R": "대여중", "B": "고장", "L": "분실", "A": "대여 가능"};
    const statMap_log = {"R": "대여", "T": "반납", "B": "고장", "L": "분실"};

    const formatDate = (dateString) => {
        if (dateString == null) return "-";
        return new Date(dateString).toLocaleString();
    }

    const PAGE_CONFIG = {
        UMBRELLA: {
            title: "우산 목록 관리",
            fetchFn: getUmbrellaListController,
            data: "umbrellas",
            id: "umbrella_id",
            columns: [
                {label: "우산 ID", key: "umbrella_id"},
                {label: "우산 종류", key: "umbrella_type", render: (val) => sizeMap[val] || val},
                {
                    label: "우산 상태", key: "umbrella_status", render: (val) => (
                        <StatusText className={`st-${val}`}>{statMap_umb[val] || val}</StatusText>
                    )
                },
                {label: "생성일시", key: "created_at", render: formatDate},
                {label: "최종수정일", key: "updated_at", render: formatDate}
            ]
        },
        USER: {
            title: "회원 목록 관리",
            fetchFn: getUserListController,
            data: "users",
            id: "user_id",
            columns: [
                {label: "사용자 ID", key: "user_id"},
                {label: "전화번호", key: "user_tel"},
                {label: "비밀번호", key: "user_pw"},
                {label: "가입일시", key: "created_at", render: formatDate}
            ]
        },
        LOG: {
            title: "이용 기록 조회",
            fetchFn: getHistoryListController,
            data: "historys",
            id: "history_id",
            columns: [
                {label: "기록 ID", key: "history_id"},
                /* 이용 기록 유형에 한글 매핑 & 색상 클래스 적용 */
                {
                    label: "유형", key: "history_type", render: (val) => (
                        <StatusText className={`st-log-${val}`}>{statMap_log[val] || val}</StatusText>
                    )
                },
                {label: "우산 ID", key: "umbrella_id"},
                {label: "사용자 ID", key: "user_id"},
                {label: "발생일시", key: "created_at", render: formatDate}
            ]
        }
    }

    const current_config = PAGE_CONFIG[mode];

    const [datas, setDatas] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [filterType, setFilterType] = useState("ALL");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [isLoading, setIsLoading] = useState(false);
    const [sizeConfig, setSizeConfig] = useState({key: null, direction: "asc", column: ""});

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await current_config.fetchFn();
                if (result.success) {
                    setDatas(result[current_config.data]);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
            setIsLoading(false);
        };
        fetchData();
        setSelectedItem(null);
    }, [mode]);

    const processedData = useMemo(() => {
        if (!datas) return [];
        let result = [...datas];

        if (mode === "UMBRELLA" && filterType !== "ALL") {
            result = result.filter(item => item.umbrella_type === filterType);
        }
        if (mode === "UMBRELLA" && filterStatus !== "ALL") {
            result = result.filter(item => item.umbrella_status === filterStatus);
        }

        if (sizeConfig.key) {
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
            case "우산 ID":
                key = current_config.id;
                break;
            case "우산 종류":
                key = "umbrella_type";
                break;
            case "우산 상태":
                key = "umbrella_status";
                break;
            case "생성일시":
            case "가입일시":
            case "발생일시":
                key = "created_at";
                break;
            case "최종수정일":
                key = "updated_at";
                break;
            case "사용자 ID":
                key = "user_id";
                break;
            case "전화번호":
                key = "user_tel";
                break;
            case "기록 ID":
                key = "history_id";
                break;
            default:
                key = null;
        }

        if (!key) return;

        let direction = "asc";
        if (sizeConfig.key === key && sizeConfig.direction === "asc") {
            direction = "desc";
        }
        setSizeConfig({key, direction, column});
    };

    const handleUmbrellaEdit = targetMode => {
        if (targetMode !== "INSERT" && !selectedItem) {
            alert("목록에서 우산을 선택해주십시오.");
            return;
        }
        navigate("/update-umbrella-info", {
            state: {mode: targetMode, selectedItem: targetMode === "INSERT" ? null : selectedItem}
        });
    }

    return (
        <AdminLayout page="dashboard">
            <Title className="dashboard">{current_config.title}</Title>

            {mode === "UMBRELLA" && (
                <BtnGroup>
                    <DashboardBtn
                        method={handleUmbrellaEdit}
                        direction="INSERT"
                        label="+ 우산 등록"
                    />
                    <DashboardBtn
                        method={handleUmbrellaEdit}
                        direction="UPDATE"
                        label="✎ 상태 수정"
                    />
                    <DashboardBtn
                        method={handleUmbrellaEdit}
                        direction="DELETE"
                        label="🗑 삭제"
                    />
                </BtnGroup>
            )}

            {selectedItem && (
                <SelectedItemBox>
                    선택된 ID: <strong>{selectedItem[current_config.id]}</strong>
                </SelectedItemBox>
            )}

            <TableWrapper>
                <Table>
                    <thead>
                    <Tr>
                        {current_config.columns.map(column => (
                            <Th key={column.label}>
                                {column.label === "우산 종류" ? (
                                    <Select
                                        value={filterType}
                                        onChange={(e) => setFilterType(e.target.value)}
                                    >
                                        <option value="ALL">종류 (전체)</option>
                                        <option value="L">장우산</option>
                                        <option value="S">단우산</option>
                                    </Select>
                                ) : column.label === "우산 상태" ? (
                                    <Select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="ALL">상태 (전체)</option>
                                        {Object.entries(statMap_umb).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </Select>
                                ) : (
                                    <SortBtn onClick={() => handleColClick(column.label)}>
                                        {column.label}
                                        {sizeConfig.column === column.label && (sizeConfig.direction === "asc" ? " ▲" : " ▼")}
                                    </SortBtn>
                                )}
                            </Th>
                        ))}
                    </Tr>
                    </thead>
                    <tbody>
                    {processedData.map((data, index) => (
                        <Tr
                            key={data[current_config.id] || index}
                            onClick={() => setSelectedItem(data)}
                            className={selectedItem === data ? "selected-row" : ""}
                        >
                            {current_config.columns.map((col) => {
                                const value = data[col.key];
                                const displayValue = col.render ? col.render(value) : value;
                                return <Td key={col.key}>{displayValue}</Td>;
                            })}
                        </Tr>
                    ))}
                    </tbody>
                </Table>
            </TableWrapper>
        </AdminLayout>
    )
}

export default DashBoardPage;