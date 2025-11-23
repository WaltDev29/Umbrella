import Manager from '../domain/Manager';
import {fetchAPIGet, fetchAPIPost} from "./UtilRepository";


// ============ SELECT ============

// 전체 관리자 조회
export async function checkAllManagers() {
    const data = await fetchAPIGet("managers", "");
    return Array.isArray(data) ? data.map(m => new Manager(m)) : [];
}



// ============ UPDATE ============

export async function updateManagerInfoView(old_pw, new_pw) {
    const res = await fetchAPIPost(
        "managers",
        "update",
        {
            manager_old_pw: old_pw,
            manager_new_pw: new_pw
        }
    );

    return await res.json();
}