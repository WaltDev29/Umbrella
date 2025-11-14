import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

// controller로부터 데이터를 불러오기 위한 함수들 import
import {getUmbrellaListController, getHistoryListController} from "../../database/controller/Controller";

function DashBoardPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [selectedItem, setSelectedItem] = useState(null); // 선택한 우산 state

    const mode = location.state?.mode || "UMBRELLA";  // ← "오류" → "UMBRELLA"
    const title = mode === "UMBRELLA" ? "우산 목록"
        : mode === "USER" ? "회원 목록"
            : "이용 기록"

    const columns = mode === "UMBRELLA" ? ["ID", "우산종류", "우산상태", "생성일시", "최종수정일"] :
        mode === "USER" ? ["ID", "전화번호", "비밀번호", "생성일시"] :
            mode === "LOG" ? ["ID", "구분", "우산", "회원", "생성일시"] : [];  // ← null → []

    // [수정] 초기값을 빈 배열로 변경 (로딩 화면을 위해)
    const [datas, setdatas] = useState([]);
    // [추가] 로딩 중인지 아닌지 상태를 저장할 '상자' (선택 사항)
    const [isLoading, setIsLoading] = useState(false);

    // 더미데이터 기반에서 데이터 불러오는 것으로 수정.
    useEffect(() => {
        const fetchData = async() => {
            setIsLoading(true); // "지금 로딩 시작!"
            try {
                let resultData = [];

                // 2. mode에 따라 import 해온 함수를 '실행(await)'합니다.
                if (mode === "UMBRELLA") {
                    const result = await getUmbrellaListController();
                    // 3. controller가 반환한 객체에서 데이터를 꺼냅니다.
                    if (result.success) resultData = result.umbrellas;

                } else if (mode === "LOG") {
                    const result = await getHistoryListController();
                    if (result.success) resultData = result.historys;
                }

                // 4. 🔥 여기가 핵심! DB에서 가져온 '진짜 데이터'로 state를 '치환'
                setdatas(resultData);

            } catch (error) {
                // 5. view에서 'throw new Error' 한 것이 여기서 잡힙니다!
                console.error("데이터 로딩 실패:", error);
                // 여기서 사용자에게 "데이터 로딩에 실패했습니다." 알림을 띄울 수 있음
            }
            setIsLoading(false); // "로딩 끝
        };

        fetchData();
    }, [mode]);

    const handleUmbrellaEdit = mode => {
        if (mode === "INSERT") navigate("/update-umbrella-info", {state: {mode: mode, selectedItem: null}});
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

        // GPT 코드인데 아직 분석 안 해서 잘 모름.
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
                            (<tr key={data.umbrella_id} onClick={() => setSelectedItem(data)}>
                                <td>{data.umbrella_id}</td>
                                <td>{data.umbrella_type}</td>
                                <td>{data.umbrella_status}</td>
                                <td>{data.created_at}</td>
                                <td>{data.updated_at}</td>
                            </tr>)
                            : mode === "USER" ?
                                (<tr key={data.id} onClick={() => setSelectedItem(data)}>
                                    <td>{data.id}</td>
                                    <td>{data.phoneNum}</td>
                                    <td>{data.password}</td>
                                    <td>{data.createdAt}</td>
                                </tr>)
                                : (<tr key={data.id} onClick={() => setSelectedItem(data)}>
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