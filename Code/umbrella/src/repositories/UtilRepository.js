// const API_URL = 'http://localhost:5000/api';
const API_URL = 'http://141.147.158.235:8080/api';

// ============ Fetch 공통 로직 ============

// GET
export async function fetchAPIGet(table,url) {
    const res = await fetch(`${API_URL}/${table}/${url}`, {method: "GET"});
    if(!res.ok) throw new Error("API 호출 실패");
    return await res.json();
}

// POST
export async function fetchAPIPost(table, url, body) {
    return await fetch(`${API_URL}/${table}/${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}