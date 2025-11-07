import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

function DashBoardPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const dummyItem = {
        "id": "UMB-12345",
        "sort": "L",
        "stat": "B"
    }

    const [selectedItem, setSelectedItem] = useState(dummyItem);

    const mode = location.state?.mode || "오류";
    const title = mode == "UMBRELLA" ? "우산 목록"
        : mode == "USER" ? "회원 목록"
            : "이용 기록"

    const columns = mode == "UMBRELLA" ? ["ID", "우산종류", "우산상태", "생성일시", "최종수정일"] :
        mode == "USER" ? ["ID", "전화번호", "비밀번호", "생성일시"] :
            mode == "LOG" ? ["ID", "구분", "우산", "회원", "생성일시"] : null;

    // 이거 DB에서 불러온 정보라고 가정함. 우산 정보만 했음.
    const [data, setData] = useState([
        {
            id: "UMB-12345",
            sort: "L",
            stat: "B",
            createdAt: "2025-10-04",
            updatedAt: "2025-11-05"
        },
        {
            id: "UMB-12346",
            sort: "S",
            stat: "R",
            createdAt: "2025-10-28",
            updatedAt: "2025-11-01"
        },
        {
            id: "UMB-12347",
            sort: "S",
            stat: "L",
            createdAt: "2025-11-04",
            updatedAt: "2025-11-06"
        }
    ])

    useEffect(() => {
        const DummyUmbrellaDatas = [{
            id: "UMB-12345",
            sort: "L",
            stat: "B",
            createdAt: "2025-10-04",
            updatedAt: "2025-11-05"
        },
            {
                id: "UMB-12346",
                sort: "S",
                stat: "R",
                createdAt: "2025-10-28",
                updatedAt: "2025-11-01"
            },
            {
                id: "UMB-12347",
                sort: "S",
                stat: "L",
                createdAt: "2025-11-04",
                updatedAt: "2025-11-06"
            }]

        const DummyUseraDatas = [{
            id: "USER-12345",
            phoneNum: "010-1234-5678",
            password: "1234",
            createdAt: "2025-10-04"
        },
            {
                id: "USER-12346",
                phoneNum: "010-5678-1234",
                password: "5678",
                createdAt: "2025-10-28"
            },
            {
                id: "USER-12347",
                phoneNum: "010-0000-0000",
                password: "0000",
                createdAt: "2025-11-04"
            }]

        const DummyLogDatas = [{
            id: "LOG-12345",
            sort: "RENTAL",
            umbId: "UMB-12345",
            userId: "USER-12345",
            createdAt: "2025-10-04"
        },
            {
                id: "LOG-12346",
                sort: "RETURN",
                umbId: "UMB-12346",
                userId: "USER-12346",
                createdAt: "2025-10-28"
            },
            {
                id: "LOG-12347",
                sort: "LOST",
                umbId: "UMB-12347",
                userId: "USER-12347",
                createdAt: "2025-11-04"
            }]

        let datas = mode == "UMBRELLA" ? DummyUmbrellaDatas :
            mode == "USER" ? DummyUseraDatas :
                DummyLogDatas
        setData(datas);

    }, [mode]);

    const handleUmbrellaEdit = mode => {
        if (mode == "INSERT") navigate("/update-umbrella-info", {state: {mode: mode, selectedItem: null}});
        else navigate("/update-umbrella-info", {state: {mode: mode, selectedItem: selectedItem}});
    }

    const [sortConfig, setSortConfig] = useState({key: null, direction: "asc", column: ""});

    const handleColClick = (column) => {
        let key;
        switch (column) {
            case "ID":
                key = "id";
                break;
            case "우산종류":
                key = "sort";
                break;
            case "우산상태":
                key = "stat";
                break;
            case "생성일시":
                key = "createdAt";
                break;
            case "최종수정일":
                key = "updatedAt";
                break;
            case "전화번호":
                key = "phoneNum";
                break;
            case "비밀번호":
                key = "password";
                break;
            case "구분":
                key = "sort";
                break;
            case "우산":
                key = "umbId";
                break;
            case "회원":
                key = "userId";
                break;
            default:
                key = null;
        }

        if (!key) return; // 해당 컬럼에 매핑된 key가 없으면 무시

        // 정렬 방향 토글
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setData(sortedData);
        setSortConfig({key, direction, column});
    };

    return (
        <div>
            <h1>{title}</h1>
            {mode == "UMBRELLA" &&
                <div>
                    <button onClick={() => handleUmbrellaEdit("INSERT")}>우산 등록</button>
                    <button onClick={() => handleUmbrellaEdit("UPDATE")}>우산 상태 수정</button>
                    <button onClick={() => handleUmbrellaEdit("DELETE")}>우산 삭제</button>
                </div>
            }
            <div>
                <table>
                    <thead>
                    {columns.map(column => {
                        return (
                            <th key={column}>
                                {column === "우산종류" ?
                                    (<select>
                                        <option value="ALL">{column}</option>
                                        <option value="L">L</option>
                                        <option value="S">S</option>
                                    </select>)
                                    : column === "구분" ?
                                        (<select>
                                            <option value="ALL">{column}</option>
                                            <option value="RENTAL">대여</option>
                                            <option value="RETURN">반납</option>
                                            <option value="BROKEN">고장</option>
                                            <option value="LOST">분실</option>
                                        </select>)
                                        : (<button onClick={() => handleColClick(column)}>
                                            {column}
                                            {sortConfig.column === column &&
                                                (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                                        </button>)
                                }
                            </th>
                        )
                    })}
                    </thead>
                    <tbody>
                    {data.map(data => (
                        mode == "UMBRELLA" ?
                            (<tr key={data.id}>
                                <td>{data.id}</td>
                                <td>{data.sort}</td>
                                <td>{data.stat}</td>
                                <td>{data.createdAt}</td>
                                <td>{data.updatedAt}</td>
                            </tr>)
                            : mode == "USER" ?
                                (<tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>{data.phoneNum}</td>
                                    <td>{data.password}</td>
                                    <td>{data.createdAt}</td>
                                </tr>)
                                : (<tr key={data.id}>
                                    <td>{data.id}</td>
                                    <td>{data.sort}</td>
                                    <td>{data.umbId}</td>
                                    <td>{data.userId}</td>
                                    <td>{data.createdAt}</td>
                                </tr>)
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DashBoardPage;