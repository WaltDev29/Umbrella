import Manager from '../domain/Manager';

const API_URL = 'http://localhost:5000/api';

// 전체 manager 조회 view
export async function checkAllManagers() {
    const res = await fetch(`${API_URL}/managers`, {method: 'GET'});
    if(!res.ok) throw new Error('관리자 목록 로드 실패');
    const data = await res.json();
    return Array.isArray(data) ? data.map(m => new Manager(m)) : [];
}

export async function updateManagerInfoView(old_pw, new_pw) {
    // 1. 'GET'이 아닌 'POST' 또는 'PATCH' 사용
    const res = await fetch(`${API_URL}/managers/update`, { // (API 주소 예시)
        method: 'POST', // "새로 생성(POST)" 또는 "수정(PATCH)"

        // 2. "지금 보내는 건 JSON 형식입니다"라고 서버에 알려줌
        headers: {
            'Content-Type': 'application/json',
        },

        // 3. 'body'(몸체)에 실제 데이터(주문서)를 실어 보냄
        body: JSON.stringify({
            manager_old_pw: old_pw,
            manager_new_pw: new_pw
        })
    });

    if (!res.ok) {
        // 4. 서버가 400, 500 에러를 주면 여기서 에러 발생
        const errorData = await res.json();
        throw new Error(errorData.message || '관리자 정보 업데이트 실패');
    }

    // 5. 성공 결과 반환
    return await res.json();
}