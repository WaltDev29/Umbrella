import Umbrella from '../domain/Umbrella';
import {fetchAPIGet, fetchAPIPost} from "./UtilRepository";


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



// ============ UPDATE ============

// CREATE
export async function createUmbrella(umbrella_type) {
    const res = await fetchAPIPost(
        "umbrellas",
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
        "umbrellas",
        "update_status",
        {'Content-Type': 'application/json'},
        {
            umbrella_status: umbrella_status,
            umbrella_id: umbrella_id
        }
    );
}

// DELETE
export async function deleteUmbrella(umbrella_id){
    await fetchAPIPost(
        "umbrellas",
        "delete",
        {'Content-Type': 'application/json'},
        {umbrella_id: umbrella_id,}
    );
}