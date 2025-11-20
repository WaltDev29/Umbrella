import Umbrellas from '../entity/Umbrellas';
const API_URL = 'http://localhost:5000/api';

// 모든 우산 목록
export async function checkAllUmbrellas() {
    const res = await fetch(`${API_URL}/umbrellas`, { method: 'GET' });
    if (!res.ok) throw new Error('우산 목록 로드 실패');
    const data = await res.json();
    return Array.isArray(data) ? data.map(u => new Umbrellas(u)) : [];
}
// 단일 우산 조회
export async function checkUmbrellaById(umbrella_id) {
    const res = await fetch(`${API_URL}/umbrellas/${umbrella_id}`, { method: 'GET' });
    if (!res.ok) return null;
    const found = await res.json();
    return found ? new Umbrellas(found) : null;
}
// 우산 신규 등록
export async function createUmbrella(umbrella_type) {
    const res = await fetch(`${API_URL}/umbrellas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ umbrella_type })
    });
    if (!res.ok) throw new Error('우산 등록 실패');
    const created = await res.json();
    return new Umbrellas(created);
}

export async function updateUmbrellaStatus(umbrella_status, umbrella_id){
    const res = await fetch(`${API_URL}/umbrellas/update_status`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            umbrella_status: umbrella_status,
            umbrella_id: umbrella_id,
        })
    })
}

export async function deleteUmbrella(umbrella_id){
    const res = await fetch(`${API_URL}/umbrellas/delete`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            umbrella_id: umbrella_id,
        })
    })
}

// 상태별 우산 개수 조회
export async function getUmbrellaStats() {
    const res = await fetch(`${API_URL}/umbrellas/stats`, { method: 'GET' });
    if (!res.ok) throw new Error('우산 통계 로드 실패');
    return await res.json(); // { total: 50, B: 5, L: 2 } 객체를 그대로 반환
}