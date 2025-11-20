import User from '../domain/User';
const API_URL = 'http://localhost:5000/api';

// 1. 새로운 사용자 등록
export async function createUser(user_tel, user_pw) {
    const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_tel, user_pw })
    });
    if (!res.ok) throw new Error('사용자 등록 실패');
    const created = await res.json();
    return new User(created);
}

// 2. 사용자 인증 조회 (전화번호+비밀번호)
export async function checkUserByTelAndPw(user_tel, user_pw) {
    const res = await fetch(`${API_URL}/users/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_tel, user_pw })
    });
    if (!res.ok) return null;
    const found = await res.json();
    return found ? new User(found) : null;
}

// 3. 전체 사용자 목록 조회
export async function checkAllUsers() {
    const res = await fetch(`${API_URL}/users`, { method: 'GET' });
    if (!res.ok) throw new Error('사용자 목록 읽기 실패');
    const data = await res.json();
    return Array.isArray(data) ? data.map(u => new User(u)) : [];
}