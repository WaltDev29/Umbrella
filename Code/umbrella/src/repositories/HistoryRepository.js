import History from '../domain/History';
import {fetchAPIGet} from "./UtilRepository";


// ============ SELECT ============

// 전체 이용기록 조회
export async function checkAllHistorys() {
    const data = await fetchAPIGet("historys", "");
    return Array.isArray(data) ? data.map(h => new History(h)) : [];
}

// 우산별 이용기록 조회
export async function checkHistoryByUmbrellaId(umbrella_id) {
    const data = await fetchAPIGet("historys/umbrella", umbrella_id);
    return Array.isArray(data) ? data.map(h => new History(h)) : [];
}
// 사용자별 이용기록 조회
export async function checkHistoryByUserId(user_id) {
    const data = await fetchAPIGet("historys/user",user_id );
    return Array.isArray(data) ? data.map(h => new History(h)) : [];
}
