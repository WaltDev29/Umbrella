import React, { useState } from 'react';

function TableViewer() {
    const [tableData, setTableData] = useState([]);
    const [tableName, setTableName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 백엔드와 일치하는 허용 테이블 목록
    const allowedTables = ['users', 'umbrellas', 'history', 'managers'];

    const fetchData = async (targetTable) => {
        setLoading(true);
        setError(null);
        setTableName(targetTable);
        setTableData([]);

        try {
            // 백엔드 API 호출
            const response = await fetch(`http://localhost:5000/api/table/${targetTable}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP 오류: ${response.status}`);
            }

            const result = await response.json();
            setTableData(result.data);
            // console.log(`데이터 로드 완료: ${targetTable} ${result.data.length}건`); // 개발자 확인용
        } catch (err) {
            setError(`데이터 로드 실패: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // 테이블 헤더 (컬럼 이름) 동적 추출
    const getHeaders = () => {
        if (tableData.length === 0) return [];
        return Object.keys(tableData[0]);
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>🛡️ DB Viewer</h1>

            <p>조회할 테이블을 선택하세요</p>
            <div>
                {allowedTables.map(table => (
                    <button
                        key={table}
                        onClick={() => fetchData(table)}
                        disabled={loading}
                        style={{ margin: '5px', padding: '10px', backgroundColor: tableName === table ? '#4CAF50' : '#f0f0f0', color: tableName === table ? 'white' : 'black', border: '1px solid #ccc' }}
                    >
                        {table.toUpperCase()}
                    </button>
                ))}
            </div>

            {loading && <p style={{ color: '#007bff' }}>데이터 로드 중... </p>}
            {error && <p style={{ color: 'red', border: '1px solid red', padding: '10px' }}> 오류: {error}</p>}

            {tableData.length > 0 && (
                <div style={{ marginTop: '20px', borderTop: '2px solid #333' }}>
                    <h3>✨ 테이블: {tableName.toUpperCase()} ({tableData.length}건) - 로드 완료</h3>
                    <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead>
                            <tr>
                                {getHeaders().map(key => (
                                    <th key={key} style={{ padding: '10px', border: '1px solid #ddd', backgroundColor: '#f4f4f4', textAlign: 'left' }}>{key}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    {/* 각 행의 데이터를 동적으로 출력 */}
                                    {Object.values(row).map((value, idx) => (
                                        <td key={idx} style={{ padding: '8px', border: '1px solid #ddd' }}>
                                            {/* 날짜 객체 처리 */}
                                            {value instanceof Date ? value.toISOString() : String(value)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {/* 데이터가 없고 로딩도 아닐 때 */}
            {!loading && !error && tableName && tableData.length === 0 && (
                <p> **{tableName.toUpperCase()}** 테이블에 데이터가 없습니다.</p>
            )}
        </div>
    );
}

export default TableViewer;