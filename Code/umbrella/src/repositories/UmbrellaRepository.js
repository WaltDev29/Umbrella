import Umbrella from '../domain/Umbrella';
const API_URL = 'http://localhost:5000/api';


// ============ Fetch 공통 로직 ============

// GET
async function fetchAPIGet(url) {
    const res = await fetch(`${API_URL}/umbrellas/${url}`, {method: "GET"});
    if(!res.ok) throw new Error("API 호출 실패");
    return await res.json();
}

// POST
async function fetchAPIPost(url,headers, body) {
    const res = await fetch(`${API_URL}/umbrellas/${url}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('우산 정보 수정 실패');
    return res;
}



// ============ SELECT ============

// 전체 우산 조회
async function getAllUmbrellas() {
    const data = fetchAPIGet("");
    return Array.isArray(data) ? data.map(u => new Umbrella(u)) : [];
}

// 단일 우산 조회 (By ID)
export async function getUmbrellasById(id) {
    const data = fetchAPIGet(id);
    return new Umbrella(data);
}

// 상태별 우산 개수 조회
export async function getUmbrellaStats() {
    return fetchAPIGet("stats");
}



// ============ UPDATE ============

// CREATE
export async function createUmbrella(umbrella_type) {
    const res = fetchAPIPost(
        "",
        { 'Content-Type': 'application/json' },
        { umbrella_type }
    )
    const createdUmbrella = await res.json();
    return new Umbrella(createdUmbrella);
}

// UPDATE
export async function updateUmbrella(umbrella_status, umbrella_id){
    await fetchAPIPost(
        "update_status",
        {'Content-Type': 'application/json'},
        {umbrella_status: umbrella_status, umbrella_id: umbrella_id,}
    );
}

// DELETE
export async function deleteUmbrella(umbrella_id){
    await fetchAPIPost(
        "delete",
        {'Content-Type': 'application/json'},
        {umbrella_id: umbrella_id,}
    );
}