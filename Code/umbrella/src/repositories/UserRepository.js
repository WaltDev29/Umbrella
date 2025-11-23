import User from '../domain/User';
import {fetchAPIGet, fetchAPIPost} from "./UtilRepository";


// ============ SELECT ============

// 전체 사용자 목록 조회
export async function checkAllUsers() {
    const data = await fetchAPIGet("users", "");
    return Array.isArray(data) ? data.map(u => new User(u)) : [];
}

// todo 이거 왜 POST? 전화번호만 받도록 수정
// 사용자 조회 (전화번호+비밀번호)
export async function checkUserByTelAndPw(user_tel, user_pw) {
    const res = await fetchAPIPost("users",
        "auth",
        { user_tel, user_pw }
    );

    if (!res.ok) return null;

    const user = await res.json();
    return user ? new User(user) : null;
}



// ============ UPDATE ============

// CREATE
export async function createUser(user_tel, user_pw) {
    const res = await fetchAPIPost(
        "users",
        "",
        { user_tel, user_pw }
    );
    if (!res.ok) throw new Error();
    const createdUser = await res.json();
    return new User(createdUser);
}