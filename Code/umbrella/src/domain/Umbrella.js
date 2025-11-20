class Umbrella {
    constructor({ umbrella_id, umbrella_type, umbrella_status, created_at, updated_at }) {
        this.umbrella_id = umbrella_id;
        this.umbrella_type = umbrella_type; // 'L', 'S'
        this.umbrella_status = umbrella_status; // 'A', 'R', 'B', 'L'
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    // todo 얘네 사용하는지 검토
    // 장/단우산 반환
    getTypeLabel() {
        return this.umbrella_type === 'L' ? '장우산' : '단우산';
    }

    // 상태 반환
    getStatusLabel() {
        switch (this.umbrella_status) {
            case 'A': return '대여 가능';
            case 'R': return '대여중';
            case 'B': return '고장';
            case 'L': return '분실';
            default: return '알수없음';
        }
    }
    // 사용가능 여부
    isAvailable() {
        return this.umbrella_status === 'A';
    }

    // 분실 여부
    isLost() {
        return this.umbrella_status === 'L';
    }
}
export default Umbrella;
