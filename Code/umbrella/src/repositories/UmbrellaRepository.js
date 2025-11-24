import Umbrella from '../domain/Umbrella';
import {fetchAPIGet, fetchAPIPost} from "./UtilRepository";
const API_URL = 'http://141.147.158.235:8080/api';


// ============ SELECT ============

// 전체 우산 조회
export async function getAllUmbrellas() {
    const data = await fetchAPIGet("umbrellas","");
    return Array.isArray(data) ? data.map(u => new Umbrella(u)) : [];
}

// 단일 우산 조회 (By ID)
export async function getUmbrellasById(id) {
    const data = await fetchAPIGet("umbrellas",id);
    return new Umbrella(data);
}

// 상태별 우산 개수 조회
export async function getUmbrellaStats() {
    return await fetchAPIGet("umbrellas","stats");
}

// 대여 가능 우산 조회
export async function getAvailableUmbrella() {
    return await fetch(`${API_URL}/umbrellas?status=A`, {
        method: 'GET'
    });
}



// ============ UPDATE ============

// CREATE
export async function createUmbrella(umbrella_type) {
    const res = await fetchAPIPost(
        "umbrellas",
        "",
        { umbrella_type }
    )
    if (!res.ok) throw new Error();
    const createdUmbrella = await res.json();
    return new Umbrella(createdUmbrella);
}

// UPDATE
export async function updateUmbrella(umbrella_status, umbrella_id){
    const res =  await fetchAPIPost(
        "umbrellas",
        "update_status",
        {
            umbrella_status: umbrella_status,
            umbrella_id: umbrella_id
        }
    );
    if (!res.ok) throw new Error();
    return res;
}

export async function updateUmbrellaStat(mode, user_id, umbrella_id){
    return await fetchAPIPost(
        "umbrellas",
        mode,
        {
            user_id: user_id,
            umbrella_id: umbrella_id
        }
    );
}


// 고장 신고
export async function defectReportUmbrella(phoneNumber, umbrella_id) {
    return await fetch(`${API_URL}/umbrellas/defect-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone: phoneNumber,
            umbrella_id: parseInt(umbrella_id)
        })
    });
}

// DELETE
export async function deleteUmbrella(umbrella_id){
    const res = await fetchAPIPost(
        "umbrellas",
        "delete",
        {umbrella_id: umbrella_id,}
    );
    if (!res.ok) throw new Error();
    return res;
}