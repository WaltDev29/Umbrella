class History {
    constructor({ history_id, history_type, umbrella_id, user_id, created_at, due_at }) {
        this.history_id = history_id;
        this.history_type = history_type; // 'R','T','B','L'
        this.umbrella_id = umbrella_id;
        this.user_id = user_id;
        this.created_at = created_at;
        this.due_at = due_at;
    }

    // todo 이거 사용할 건지.
    getTypeLabel() {
        switch (this.history_type) {
            case 'R': return '대여';
            case 'T': return '반납';
            case 'B': return '고장 신고';
            case 'L': return '분실 신고';
            default: return '알수없음';
        }
    }
}
export default History;
