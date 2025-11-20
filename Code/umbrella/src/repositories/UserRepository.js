import User from '../domain/User';
const API_URL = 'http://localhost:5000/api';

// ============ Fetch 공통 로직 ============

// GET
async function fetchAPIGet(table,url) {
    const res = await fetch(`${API_URL}/${table}/${url}`, {method: "GET"});
    if(!res.ok) throw new Error("API 호출 실패");
    return await res.json();
}

// POST
async function fetchAPIPost(table, url,headers, body) {
    const res = await fetch(`${API_URL}/${table}/${url}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error("API 호출 실패");
    return res;
}

// ============ SELECT ============

// 전체 사용자 목록 조회
export async function checkAllUsers() {
    const res = await fetchAPIGet("users", "");
    return Array.isArray(res) ? res.map(u => new User(u)) : [];
}

// todo 이거 왜 POST? 전화번호만 받도록 수정
// 사용자 조회 (전화번호+비밀번호)
export async function checkUserByTelAndPw(user_tel, user_pw) {
    const res = await fetchAPIPost("users",
        "auth",
        { 'Content-Type': 'application/json' },
        { user_tel, user_pw }
    );
    const user = await res.json();
    return user ? new User(user) : null;
}



// ============ UPDATE ============

// CREATE
export async function createUser(user_tel, user_pw) {
    const res = await fetchAPIPost(
        "users",
        "",
        { 'Content-Type': 'application/json' },
        { user_tel, user_pw }
    );
    const createdUser = await res.json();
    return new User(createdUser);
}