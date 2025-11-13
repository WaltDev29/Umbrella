import History from '../entity/History';
const API_URL = 'http://localhost:5000/api';

// 전체 history 조회
export async function checkAllHistorys() {
    const res = await fetch(`${API_URL}/historys`, { method: 'GET' });
    if (!res.ok) throw new Error('히스토리 목록 로드 실패');
    const data = await res.json();
    return Array.isArray(data) ? data.map(h => new History(h)) : [];
}
// 우산별 이력 조회
export async function checkHistoryByUmbrellaId(umbrella_id) {
    const res = await fetch(`${API_URL}/historys/umbrella/${umbrella_id}`, { method: 'GET' });
    if (!res.ok) throw new Error('해당 우산의 이력 조회 실패');
    const data = await res.json();
    return Array.isArray(data) ? data.map(h => new History(h)) : [];
}
// 사용자별 이력 조회
export async function checkHistoryByUserId(user_id) {
    const res = await fetch(`${API_URL}/historys/user/${user_id}`, { method: 'GET' });
    if (!res.ok) throw new Error('해당 사용자의 이력 조회 실패');
    const data = await res.json();
    return Array.isArray(data) ? data.map(h => new History(h)) : [];
}
