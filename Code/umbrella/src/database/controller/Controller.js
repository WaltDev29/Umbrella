import { createUser, checkUserByTelAndPw } from '../view/UsersView';
import Users from '../../database/entity/Users';
import { checkAllUmbrellas, checkUmbrellaById, createUmbrella } from '../view/UmbrellasView';
import Umbrellas from '../../database/entity/Umbrellas';
import { checkAllHistorys, checkHistoryByUmbrellaId, checkHistoryByUserId } from '../view/HistorysView';
import Historys from '../../database/entity/Historys';

//==================== 1. User 로직 ====================
// 인증 컨트롤러: 전화번호와 비밀번호로 사용자 인증
export async function UserLoginController(phone, password) {
    const tempUser = new Users({ user_id: null, user_tel: phone, user_pw: password });
    if (!tempUser.isTelTrue()) return { valid: false, error: '휴대전화 형식이 올바르지 않습니다.' };
    if (!tempUser.isPasswordTrue()) return { valid: false, error: 'PIN은 4자리 숫자여야 합니다.' };
    const user = await checkUserByTelAndPw(phone, password);
    if (!user) return { valid: false, error: '일치하는 사용자가 없습니다.' };
    return { valid: true, user };
}

// 신규 가입 컨트롤러
export async function NewUserController(phone, password) {
    const tempUser = new Users({ user_id: null, user_tel: phone, user_pw: password });
    if (!tempUser.isTelTrue()) return { success: false, error: '휴대전화 형식이 올바르지 않습니다.' };
    if (!tempUser.isPasswordTrue()) return { success: false, error: '비밀번호는 4자리 숫자여야 합니다.' };
    try {
        const created = await createUser(phone, password);
        return { success: true, user: created };
    } catch (err) {
        return { success: false, error: '사용자 등록에 실패했습니다.' };
    }
}

//==================== 2. Umbrellas 로직 ====================
// 전체 목록 반환
export async function getUmbrellaListController() {
    try {
        const umbrellas = await checkAllUmbrellas();
        return { success: true, umbrellas };
    } catch (err) {
        return { success: false, error: '우산 목록 불러오기 실패' };
    }
}
// 단일 우산 반환
export async function getUmbrellaByIdController(umbrella_id) {
    const umbrellas = await checkUmbrellaById(umbrella_id);
    if (!umbrella) return { success: false, error: '존재하지 않는 우산입니다.' };
    return { success: true, umbrellas };
}
// 등록
export async function addUmbrellaController(umbrella_type) {
    if (umbrella_type !== 'L' && umbrella_type !== 'S') {
        return { success: false, error: '우산 타입은 "L" 또는 "S"만 가능합니다.' };
    }
    try {
        const created = await createUmbrella(umbrella_type);
        return { success: true, umbrella: created };
    } catch (err) {
        return { success: false, error: '우산 등록 실패' };
    }
}

//==================== 3. Historys 로직 ====================
// 전체 이력 반환
export async function getHistoryListController() {
    try {
        const historys = await checkAllHistorys();
        return { success: true, historys };
    } catch (err) {
        return { success: false, error: '이력 목록 불러오기 실패' };
    }
}
// 우산별 이력 반환
export async function getHistoryByUmbrellaController(umbrella_id) {
    try {
        const historys = await checkHistoryByUmbrellaId(umbrella_id);
        return { success: true, historys };
    } catch (err) {
        return { success: false, error: '해당 우산 이력 불러오기 실패' };
    }
}
// 사용자별 이력 반환
export async function getHistoryByUserController(user_id) {
    try {
        const historys = await checkHistoryByUserId(user_id);
        return { success: true, historys };
    } catch (err) {
        return { success: false, error: '해당 사용자 이력 불러오기 실패' };
    }
}
