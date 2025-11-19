const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = {
    host: '192.168.24.156',
    user: 'team_user',
    password: '1234',
    database: 'umbrella',
    port: 3306
};

// 우산 전체 조회
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM umbrellas');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: '우산 목록 로드 실패.' });
    } finally {
        if (connection) connection.end();
    }
});

// 상태별 우산 개수 조회(count)
router.get('/stats', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        // 1. 전체 개수 쿼리
        const [totalRows] = await connection.execute('SELECT COUNT(*) AS totalCount FROM umbrellas');

        // 2. 상태별 개수 쿼리
        const [statusRows] = await connection.execute(
            'SELECT umbrella_status, COUNT(*) AS count FROM umbrellas GROUP BY umbrella_status'
        );

        // 3. 데이터를 하나의 JSON으로 조립
        const stats = {
            total: totalRows[0].totalCount, // { total: 50 }
        };

        // statusRows = [ { umbrella_status: 'B', count: 5 }, { umbrella_status: 'L', count: 2 } ]
        statusRows.forEach(row => {
            stats[row.umbrella_status] = row.count; // { total: 50, B: 5, L: 2 }
        });

        res.status(200).json(stats); // 4. "조립된 통계 객체"를 반환!

    } catch (err) {
        res.status(500).json({ message: '통계 로드 실패.' });
    } finally {
        if (connection) connection.end();
    }
});

// 단일 우산 조회
router.get('/:umbrella_id', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM umbrellas WHERE umbrella_id=?', [req.params.umbrella_id]);
        if (rows.length === 0) return res.status(404).json(null);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: '우산 정보 불러오기 실패.' });
    } finally {
        if (connection) connection.end();
    }
});

// 우산 등록
router.post('/', async (req, res) => {
    const { umbrella_type } = req.body;
    if (umbrella_type !== 'L' && umbrella_type !== 'S') {
        return res.status(400).json({ message: '우산 타입은 "L" 또는 "S"만 가능합니다.' });
    }
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO umbrellas (umbrella_type, umbrella_status, created_at) VALUES (?, "A", NOW())',
            [umbrella_type]
        );
        res.status(201).json({ umbrella_id: result.insertId, umbrella_type, umbrella_status: 'A', created_at: new Date(), updated_at: null });
    } catch (err) {
        res.status(500).json({ message: '우산 등록 실패' });
    } finally {
        if (connection) connection.end();
    }
});

// 상태변경 함수
async function updateUmbrellaStatus(umbrella_id, status, user_id, history_type, due_at = null) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        // 1. 우산 상태 변경
        await connection.execute(
            'UPDATE umbrellas SET umbrella_status=?, updated_at=NOW() WHERE umbrella_id=?',
            [status, umbrella_id]
        );
        // 2. history 기록
        await connection.execute(
            'INSERT INTO history (history_type, umbrella_id, user_id, created_at) VALUES (?, ?, ?, NOW())',
            [history_type, umbrella_id, user_id]
        );
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    } finally {
        if (connection) connection.end();
    }
}

// 대여: PATCH /api/umbrellas/:umbrella_id/rent
router.patch('/:umbrella_id/rent', async (req, res) => {
    const user_id = req.body.user_id;
    const result = await updateUmbrellaStatus({
        umbrella_id: req.params.umbrella_id,
        new_status: 'R',
        user_id,
        history_type: 'R' // 대여
    });
    res.status(result.success ? 200 : 500).json(result);
});

// 반납: PATCH /api/umbrellas/:umbrella_id/return
router.patch('/:umbrella_id/return', async (req, res) => {
    const user_id = req.body.user_id;
    const result = await updateUmbrellaStatus({
        umbrella_id: req.params.umbrella_id,
        new_status: 'A',
        user_id,
        history_type: 'T' // 반납
    });
    res.status(result.success ? 200 : 500).json(result);
});

// 고장 신고: PATCH /api/umbrellas/:umbrella_id/broken
router.patch('/:umbrella_id/broken', async (req, res) => {
    const user_id = req.body.user_id;
    const result = await updateUmbrellaStatus({
        umbrella_id: req.params.umbrella_id,
        new_status: 'B',
        user_id,
        history_type: 'B' // 고장
    });
    res.status(result.success ? 200 : 500).json(result);
});

// 분실 신고: PATCH /api/umbrellas/:umbrella_id/lost
router.patch('/:umbrella_id/lost', async (req, res) => {
    const user_id = req.body.user_id;
    const result = await updateUmbrellaStatus({
        umbrella_id: req.params.umbrella_id,
        new_status: 'L',
        user_id,
        history_type: 'L' // 분실
    });
    res.status(result.success ? 200 : 500).json(result);
});

// 관리자 페이지 우산 상태 수정 함수
router.post('/update_status', async(req, res) => {
    // 1. 🌟 View가 'body'에 실어 보낸 데이터를 req.body로 꺼냄
    const { umbrella_status, umbrella_id } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 2. 'SELECT'가 아닌 'UPDATE' 또는 'INSERT' 쿼리 실행
        await connection.execute(
            'UPDATE umbrellas SET umbrella_status = ? WHERE umbrella_id = ?',
            [umbrella_status, umbrella_id]
        );

        res.status(200).json({ success: true, message: '우산 상태 업데이트 성공' });

    } catch (err) {
        res.status(500).json({ message: 'DB 업데이트 실패: ' + err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.post('/delete', async(req, res) => {
    console.log("데이터 확인 "+req.body);
    const {umbrella_id} = req.body;

    let connection;

    try{
        connection = await mysql.createConnection(dbConfig);
        
        await connection.execute(
            'DELETE FROM umbrellas WHERE umbrella_id = ?',
            [umbrella_id]
        );

        res.status(200).json({ success: true, message: '업데이트 성공' });
    } catch(err) {
        res.status(500).json({ message: '우산 데이터 삭제 실패: ' + err.message });
    } finally {
        if(connection) connection.end();
    }
});

module.exports = router;
