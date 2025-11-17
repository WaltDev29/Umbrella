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

// ==================== 전체 우산 조회 및 우산 상태별 조회 ====================
// GET /api/umbrellas  (전체)
// GET /api/umbrellas?status=A  (상태별)
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const { status } = req.query;

        let query = 'SELECT * FROM umbrellas WHERE 1=1';
        const params = [];

        // status 필터링 (status=A인 것만)
        if (status) {
            query += ' AND umbrella_status = ?';
            params.push(status);
        }

        const [rows] = await connection.execute(query, params);
        res.status(200).json(rows);

    } catch (err) {
        res.status(500).json({ message: '우산 조회 실패' });
    } finally {
        if (connection) connection.end();
    }
});

// ==================== 단일 우산 조회 ====================
router.get('/:umbrella_id', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM umbrellas WHERE umbrella_id = ?',
            [req.params.umbrella_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: '우산을 찾을 수 없습니다.' });
        }

        res.status(200).json(rows[0]);

    } catch (err) {
        res.status(500).json({ message: '우산 정보 조회 실패' });
    } finally {
        if (connection) connection.end();
    }
});

// ==================== 우산 등록 ====================
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

        res.status(201).json({
            umbrella_id: result.insertId,
            umbrella_type,
            umbrella_status: 'A',
            created_at: new Date()
        });

    } catch (err) {
        res.status(500).json({ message: '우산 등록 실패' });
    } finally {
        if (connection) connection.end();
    }
});

// ==================== 사용자의 대여중인 우산 조회 ====================
router.post('/borrowed', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute(
            `SELECT u.* FROM umbrellas u 
             WHERE u.umbrella_status = "R" 
             AND u.umbrella_id = (
                 SELECT umbrella_id FROM history 
                 WHERE user_id = ? AND history_type = "R" 
                 ORDER BY created_at DESC 
                 LIMIT 1
             )`,
            [user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: '대여 중인 우산이 없습니다.' });
        }

        res.status(200).json(rows[0]);

    } catch (err) {
        console.error('대여 우산 조회 에러:', err);
        res.status(500).json({ message: '대여 우산 조회 실패', error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

// ==================== 상태 변경 Helper 함수 ====================
async function updateUmbrellaStatus(umbrella_id, new_status, user_id, history_type) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 1. 우산 상태 변경
        await connection.execute(
            'UPDATE umbrellas SET umbrella_status = ?, updated_at = NOW() WHERE umbrella_id = ?',
            [new_status, umbrella_id]
        );

        // 2. 히스토리 저장
        await connection.execute(
            'INSERT INTO history (history_type, umbrella_id, user_id, created_at) VALUES (?, ?, ?, NOW())',
            [history_type, umbrella_id, user_id]
        );

        return { success: true, message: '성공' };

    } catch (err) {
        return { success: false, error: err.message };
    } finally {
        if (connection) connection.end();
    }
}

// ==================== 대여: POST /api/umbrellas/borrow ====================
router.post('/borrow', async (req, res) => {
    const { user_id, umbrella_id } = req.body;

    if (!user_id || !umbrella_id) {
        return res.status(400).json({ message: '사용자 ID와 우산 ID가 필요합니다.' });
    }

    const result = await updateUmbrellaStatus(umbrella_id, 'R', user_id, 'R');
    res.status(result.success ? 200 : 500).json(result);
});

// ==================== 반납: POST /api/umbrellas/return ====================
router.post('/return', async (req, res) => {
    const { user_id, umbrella_id } = req.body;

    if (!user_id || !umbrella_id) {
        return res.status(400).json({ message: '사용자 ID와 우산 ID가 필요합니다.' });
    }

    const result = await updateUmbrellaStatus(umbrella_id, 'A', user_id, 'T');
    res.status(result.success ? 200 : 500).json(result);
});

// ==================== 분실 신고: POST /api/umbrellas/loss-report ====================
router.post('/loss-report', async (req, res) => {
    const { user_id, umbrella_id } = req.body;

    if (!user_id || !umbrella_id) {
        return res.status(400).json({ message: '사용자 ID와 우산 ID가 필요합니다.' });
    }

    const result = await updateUmbrellaStatus(umbrella_id, 'L', user_id, 'L');
    res.status(result.success ? 200 : 500).json(result);
});

// ==================== 고장 신고: POST /api/umbrellas/defect-report ====================
router.post('/defect-report', async (req, res) => {
    const { phone, umbrella_id } = req.body;

    if (!phone) {
        return res.status(400).json({ message: '휴대폰 번호를 입력해주세요.' });
    }

    if (!umbrella_id) {
        return res.status(400).json({ message: '우산 ID가 필요합니다.' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 1. 사용자 존재 확인
        const [users] = await connection.execute(
            'SELECT user_id FROM users WHERE user_tel = ?',
            [phone]
        );

        let user_id = null;

        // 2. 신규 사용자면 추가
        if (users.length === 0) {
            try {
                const [result] = await connection.execute(
                    'INSERT INTO users (user_tel, user_pw, created_at) VALUES (?, ?, NOW())',
                    [phone, '0000']
                );

                user_id = result.insertId;
            } catch (insertErr) {
                console.error('사용자 추가 에러:', insertErr);
                return res.status(500).json({ message: '사용자 추가 실패' });
            }
        } else {
            user_id = users[0].user_id;
        }

        // 3. 우산 상태 변경 (B = 고장)
        await connection.execute(
            'UPDATE umbrellas SET umbrella_status = "B", updated_at = NOW() WHERE umbrella_id = ?',
            [umbrella_id]
        );

        // 4. 히스토리 저장
        await connection.execute(
            'INSERT INTO history (history_type, umbrella_id, user_id, created_at) VALUES ("B", ?, ?, NOW())',
            [umbrella_id, user_id]
        );

        res.status(200).json({ success: true, message: '고장 신고 완료' });

    } catch (err) {
        console.error('고장 신고 에러:', err);
        res.status(500).json({ message: '고장 신고 처리 실패', error: err.message });
    } finally {
        if (connection) connection.end();
    }
});



module.exports = router;
