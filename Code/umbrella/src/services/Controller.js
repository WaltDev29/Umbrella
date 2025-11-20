import {createUser, checkUserByTelAndPw, checkAllUsers} from '../repositories/UserRepository';
import User from '../domain/User';
import { getUmbrellas, checkUmbrellaById, createUmbrella } from '../repositories/UmbrellaRepository';
import { checkAllHistorys, checkHistoryByUmbrellaId, checkHistoryByUserId } from '../repositories/HistoryRepository';
import {checkAllManagers} from "../repositories/ManagerRepository";
import {getUmbrellaStats} from "../repositories/UmbrellaRepository";
import {updateManagerInfoView} from "../repositories/ManagerRepository";
import {updateUmbrella} from "../repositories/UmbrellaRepository";
import {deleteUmbrella} from "../repositories/UmbrellaRepository";

// ============ fetch 공통 로직 ============
// export async function fetchAPIGet(url) {
//     const res = await fetch(url, {method: "GET"});
//     if(!res.ok) throw new Error(message);
//     return await res.json();
// }

//==================== 1. User 로직 ====================
// todo 이거 안 쓰고 뭐로 인증하고 가입함?
// todo 로직이 겹치는 게 많아서 유효성 검사 부분 통합할 수 있을 것 같은데
// 인증 컨트롤러: 전화번호와 비밀번호로 사용자 인증
export async function UserLoginController(phone, password) {
    const tempUser = new User({ user_id: null, user_tel: phone, user_pw: password });
    if (!tempUser.isTelValid()) return { valid: false, error: '휴대전화 형식이 올바르지 않습니다.' };
    if (!tempUser.isPasswordValid()) return { valid: false, error: 'PIN은 4자리 숫자여야 합니다.' };
    const user = await checkUserByTelAndPw(phone, password);
    if (!user) return { valid: false, error: '일치하는 사용자가 없습니다.' };
    return { valid: true, user };
}

// 신규 가입 컨트롤러
export async function NewUserController(phone, password) {
    const tempUser = new User({ user_id: null, user_tel: phone, user_pw: password });
    if (!tempUser.isTelValid()) return { success: false, error: '휴대전화 형식이 올바르지 않습니다.' };
    if (!tempUser.isPasswordValid()) return { success: false, error: '비밀번호는 4자리 숫자여야 합니다.' };
    try {
        const created = await createUser(phone, password);
        return { success: true, user: created };
    } catch (err) {
        return { success: false, error: '사용자 등록에 실패했습니다.' };
    }
}

//==================== 2. Umbrella 로직 ====================
// todo 이거 presentation에서 처리하도록?
// 전체 목록 반환
export async function getUmbrellaListController() {
    try {
        const umbrellas = await getUmbrellas("");
        return { success: true, umbrellas };
    } catch (err) {
        return { success: false, error: '우산 목록 불러오기 실패' };
    }
}
// 단일 우산 반환
export async function getUmbrellaByIdController(umbrella_id) {
    const umbrellas = await checkUmbrellaById(umbrella_id);
    if (!umbrellas) return { success: false, error: '존재하지 않는 우산입니다.' };
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

//==================== 3. History 로직 ====================
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

// ==================== 4. Manager 로직 ====================
export async function getManagerListController(){
    try {
        const managers = await checkAllManagers();
        return { success: true, managers };
    } catch (err) {
        return { success: false, error: '관리자 목록 불러오기 실패' };
    }
}

export async function updateManagerInfoController(old_pw, new_pw) {
    try {
        // 1. View단 함수에게 데이터 전달
        const result = await updateManagerInfoView(old_pw, new_pw);
        return { success: true, data: result };
    } catch (err) {
        // 2. View에서 'throw'한 에러를 여기서 잡음
        throw new Error('컨트롤러 처리 실패: ' + err.message);
    }
}

export async function updateUmbrellaStatusController(umbrella_status, umbrella_id) {
    try {
        // 1. View단 함수에게 데이터 전달
        const result = await updateUmbrella(umbrella_status, umbrella_id);
        return { success: true, data: result };
    } catch (err) {
        // 2. View에서 'throw'한 에러를 여기서 잡음
        throw new Error('컨트롤러 처리 실패: ' + err.message);
    }
}

export async function deleteUmbrellaController(umbrella_id) {
    try {
        // 1. View단 함수에게 데이터 전달
        const result = await deleteUmbrella(umbrella_id);
        return { success: true, data: result };
    } catch (err) {
        // 2. View에서 'throw'한 에러를 여기서 잡음
        throw new Error('컨트롤러 처리 실패: ' + err.message);
    }
}



// ==================== 대여 ====================
export async function BorrowCheckController(phone, password) {
    try {
        // 1. 기존 사용자 확인
        let user = await checkUserByTelAndPw(phone, password);

        if (user) {
            // 대여중인 우산 확인
            const borrowedUmbrella = await checkBorrowedUmbrella(user.user_id);

            if (borrowedUmbrella) {
                return {
                    valid: true,
                    hasActiveLoan: true,
                    message: '반납 후 이용해주세요.'
                };
            }

            return {
                valid: true,
                hasActiveLoan: false,
                isNewUser: false,
                user: user
            };
        }

        // 2. 신규 사용자 → 자동 등록
        user = await createUser(phone, password);
        return {
            valid: true,
            hasActiveLoan: false,
            isNewUser: true,
            user: user
        };

    } catch (error) {
        return { valid: false, error: 'DB 오류' };
    }
}

// ==================== 반납 ====================
export async function ReturnCheckController(phone, password) {
    try {
        // 1. 사용자 조회
        const user = await checkUserByTelAndPw(phone, password);

        if (!user) {
            return { valid: false, error: '등록되지 않은 사용자입니다.' };
        }

        // 2. 대여중 우산 확인
        const umbrella = await checkBorrowedUmbrella(user.user_id);

        if (!umbrella) {
            return { valid: false, error: '대여 기록이 없습니다.' };
        }

        return {
            valid: true,
            user: user,
            umbrella: umbrella
        };

    } catch (error) {
        return { valid: false, error: 'DB 오류' };
    }
}

// ==================== 분실 신고 ====================
export async function LossReportCheckController(phone, password) {
    try {
        // 1. 사용자 조회
        const user = await checkUserByTelAndPw(phone, password);

        if (!user) {
            return { valid: false, error: '등록되지 않은 사용자입니다.' };
        }

        // 2. 대여중 우산 확인
        const umbrella = await checkBorrowedUmbrella(user.user_id);

        if (!umbrella) {
            return { valid: false, error: '대여 기록이 없습니다.' };
        }

        return {
            valid: true,
            user: user,
            umbrella: umbrella
        };

    } catch (error) {
        return { valid: false, error: 'DB 오류' };
    }
}

// ==================== 고장 신고 ====================
export async function DefectReportController(phone, umbrellaId) {
    try {
        const res = await fetch('http://localhost:5000/api/umbrellas/defect-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, umbrella_id: umbrellaId })
        });

        if (!res.ok) {
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

// ==================== Helper 함수 ====================
async function checkBorrowedUmbrella(user_id) {
    try {
        const res = await fetch('http://localhost:5000/api/umbrellas/borrowed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id })
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        return null;
    }
}

// 우산 개수 조회
export async function getUmbrellaStatsController() {
    try {
        const stats = await getUmbrellaStats();
        return { success: true, stats: stats }; // 'stats' 객체를 반환
    } catch (err) {
        return { success: false, error: '우산 통계 로드 실패' };
    }
}

// 전체 사용자 목록 반환
export async function getUserListController(){
    try {
        const users = await checkAllUsers();
        return { success: true, users };
    } catch (err) {
        return { success: false, error: '사용자 목록 불러오기 실패' };
    }
}
