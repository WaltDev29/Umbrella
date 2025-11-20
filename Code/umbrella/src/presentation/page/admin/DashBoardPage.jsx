import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

// controller로부터 데이터를 불러오기 위한 함수들 import
import {getUmbrellaListController, getUserListController, getHistoryListController} from "../../../services/Controller";

function DashBoardPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedItem, setSelectedItem] = useState(null); // 선택한 우산 state

    const mode = location.state?.mode || "UMBRELLA";
    const title = mode === "UMBRELLA" ? "우산 목록"
        : mode === "USER" ? "회원 목록"
            : "이용 기록"

    const columns = mode === "UMBRELLA" ? ["ID", "우산종류", "우산상태", "생성일시", "최종수정일"] :
        mode === "USER" ? ["ID", "전화번호", "비밀번호", "생성일시"] :
            mode === "LOG" ? ["ID", "구분", "우산", "회원", "생성일시"] : [];

    const [datas, setdatas] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // 데이터 불러오기
    useEffect(() => {
        const fetchData = async() => {
            setIsLoading(true);
            try {
                let resultData = [];

                if (mode === "UMBRELLA") {
                    const result = await getUmbrellaListController();
                    if (result.success) resultData = result.umbrellas;
                } else if(mode== "USER"){
                    const result = await getUserListController();
                    if(result.success) resultData = result.users;
                } else if (mode === "LOG") {
                    const result = await getHistoryListController();
                    if (result.success) resultData = result.historys;
                }
                setdatas(resultData);

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
            setIsLoading(false);
        };

        fetchData();
    }, [mode]);

    // 선택 확인용 로그 (디버깅용)
    useEffect(() => {
        console.log("selectedItem이 변경되었습니다:", selectedItem);
    }, [selectedItem]);

    const handleUmbrellaEdit = targetMode => {
        console.log("핸들 실행", targetMode, selectedItem);

        // 1. 등록 (INSERT) - 데이터 필요 없음
        if (targetMode === "INSERT") {
            navigate("/update-umbrella-info", {
                state: { mode: targetMode, selectedItem: null }
            });
        }
        // 2. 수정 (UPDATE) - 데이터 필수
        else if (targetMode === "UPDATE") {
            if (!selectedItem) {
                alert("수정할 우산을 목록에서 선택해주세요.");
                return;
            }
            navigate("/update-umbrella-info", {
                state: { mode: targetMode, selectedItem: selectedItem }
            });
        }
        // 3. 삭제 (DELETE) - 데이터 필수 (수정과 동일한 패턴!)
        else if (targetMode === "DELETE") {
            if (!selectedItem) {
                alert("삭제할 우산을 목록에서 선택해주세요.");
                return;
            }
            // 삭제 모드일 때도 selectedItem을 똑같이 넘겨줍니다.
            navigate("/update-umbrella-info", {
                state: { mode: targetMode, selectedItem: selectedItem }
            });
        }
    }

    const [sortConfig, setSortConfig] = useState({key: null, direction: "asc", column: ""});

    const handleColClick = (column) => {
        let key;
        switch (column) {
            case "ID": key = "id"; break;
            case "우산종류": key = "sort"; break;
            case "우산상태": key = "stat"; break;
            case "생성일시": key = "createdAt"; break;
            case "최종수정일": key = "updatedAt"; break;
            case "전화번호": key = "phoneNum"; break;
            case "비밀번호": key = "password"; break;
            case "구분": key = "sort"; break;
            case "우산": key = "umbId"; break;
            case "회원": key = "userId"; break;
            default: key = null;
        }

        if (!key) return;

        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...datas].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setdatas(sortedData);
        setSortConfig({key, direction, column});
    };

    return (
        <div>
            <h1>{title}</h1>
            {mode === "UMBRELLA" &&
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
                    {datas.map(data => (
                        mode === "UMBRELLA" ?
                            (<tr key={data.umbrella_id} onClick={() => {setSelectedItem(data)}}>
                                <td>{data.umbrella_id}</td>
                                <td>{data.umbrella_type}</td>
                                <td>{data.umbrella_status}</td>
                                <td>{data.created_at}</td>
                                <td>{data.updated_at}</td>
                            </tr>)
                            : mode === "USER" ?
                                (<tr key={data.user_id} onClick={() => {setSelectedItem(data)}}>
                                    <td>{data.user_id}</td>
                                    <td>{data.user_tel}</td>
                                    <td>{data.user_pw}</td>
                                    <td>{data.created_at}</td>
                                </tr>)
                                : (<tr key={data.history_id} onClick={() => {setSelectedItem(data)}}>
                                    <td>{data.history_id}</td>
                                    <td>{data.history_type}</td>
                                    <td>{data.umbrella_id}</td>
                                    <td>{data.user_id}</td>
                                    <td>{data.created_at}</td>
                                    <td>{data.due_at}</td>
                                </tr>)
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default DashBoardPage;