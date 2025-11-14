import Managers from '../entity/Managers';
const API_URL = 'http://localhost:5000/api';

// 전체 manager 조회 view
export async function checkAllManagers() {
    const res = await fetch(`${API_URL}/managers`, {method: 'GET'});
    if(!res.ok) throw new Error('관리자 목록 로드 실패');
    const data = await res.json();
    return Array.isArray(data) ? data.map(m => new Managers(m)) : [];
}