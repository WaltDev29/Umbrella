const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const status = req.query.status; // 예: 'A'(대여가능)

    let sql = 'SELECT * FROM umbrellas';
    let params = [];

    if (status) {
        sql += ' WHERE umbrella_status = ?';
        params.push(status);
    }

    try {
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '우산 목록 조회 실패' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM umbrellas WHERE umbrella_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json(null);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '우산 조회 실패' });
    }
});

router.post('/', async (req, res) => {
    const { umbrella_type } = req.body; // 'L' or 'S'
    try {
        const [result] = await pool.query(
            'INSERT INTO umbrellas (umbrella_type, umbrella_status, created_at, updated_at) VALUES (?, "A", NOW(), NOW())',
            [umbrella_type]
        );
        const [rows] = await pool.query('SELECT * FROM umbrellas WHERE umbrella_id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '우산 등록 실패' });
    }
});

router.post('/borrowed', async (req, res) => {
    const { user_id } = req.body;
    try {
        const sql = `
            SELECT u.* FROM history h
            JOIN umbrellas u ON h.umbrella_id = u.umbrella_id
            WHERE h.user_id = ? 
            ORDER BY h.created_at DESC 
            LIMIT 1
        `;
        const [rows] = await pool.query(sql, [user_id]);

        // 가장 최근 기록이 'R'이고 우산 상태도 'R'이어야 현재 대여중으로 간주
        if (rows.length > 0 && rows[0].umbrella_status === 'R') {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: '대여 중인 우산이 없습니다.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB 오류' });
    }
});

router.post('/borrow', async (req, res) => {
    const { user_id, umbrella_id } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query('UPDATE umbrellas SET umbrella_status = "R", updated_at = NOW() WHERE umbrella_id = ?', [umbrella_id]);
        await conn.query('INSERT INTO history (history_type, umbrella_id, user_id, created_at) VALUES ("R", ?, ?, NOW())', [umbrella_id, user_id]);
        await conn.commit();
        res.json({ success: true, message: '대여 처리가 완료되었습니다.' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ success: false, message: '대여 처리 중 오류 발생' });
    } finally {
        conn.release();
    }
});

router.post('/return', async (req, res) => {
    const { user_id, umbrella_id } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await conn.query('UPDATE umbrellas SET umbrella_status = "A", updated_at = NOW() WHERE umbrella_id = ?', [umbrella_id]);
        await conn.query('INSERT INTO history (history_type, umbrella_id, user_id, created_at) VALUES ("T", ?, ?, NOW())', [umbrella_id, user_id]);
        await conn.commit();
        res.json({ success: true, message: '반납 처리가 완료되었습니다.' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ success: false, message: '반납 처리 중 오류 발생' });
    } finally {
        conn.release();
    }
});

router.post('/loss-report', async (req, res) => {
    const { user_id, umbrella_id } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        await conn.query('UPDATE umbrellas SET umbrella_status = "L", updated_at = NOW() WHERE umbrella_id = ?', [umbrella_id]);

        await conn.query('INSERT INTO history (history_type, umbrella_id, user_id, created_at) VALUES ("L", ?, ?, NOW())', [umbrella_id, user_id]);

        await conn.commit();
        res.json({ success: true, message: '분실 신고가 접수되었습니다.' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ success: false, message: '분실 신고 처리 실패' });
    } finally {
        conn.release();
    }
});

router.post('/defect-report', async (req, res) => {
    const { phone, umbrella_id } = req.body;
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const [users] = await conn.query('SELECT user_id FROM users WHERE user_tel = ?', [phone]);

        let userId = null;
        if (users.length > 0) {
            userId = users[0].user_id;
        } else {
            throw new Error('등록되지 않은 사용자 전화번호입니다.');
        }

        await conn.query('UPDATE umbrellas SET umbrella_status = "B", updated_at = NOW() WHERE umbrella_id = ?', [umbrella_id]);

        await conn.query('INSERT INTO history (history_type, umbrella_id, user_id, created_at) VALUES ("B", ?, ?, NOW())', [umbrella_id, userId]);

        await conn.commit();
        res.json({ success: true, message: '고장 신고가 접수되었습니다.' });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ success: false, message: err.message || '고장 신고 처리 실패' });
    } finally {
        conn.release();
    }
});

router.post('/update_status', async (req, res) => {
    const { umbrella_status, umbrella_id } = req.body;
    try {
        await pool.query(
            'UPDATE umbrellas SET umbrella_status = ?, updated_at = NOW() WHERE umbrella_id = ?',
            [umbrella_status, umbrella_id]
        );
        res.json({ success: true, message: '우산 상태 업데이트 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB 업데이트 실패' });
    }
});

router.post('/delete', async (req, res) => {
    const { umbrella_id } = req.body;
    try {
        await pool.query('DELETE FROM umbrellas WHERE umbrella_id = ?', [umbrella_id]);
        res.json({ success: true, message: '우산 삭제 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '우산 데이터 삭제 실패 (이력이 존재하는 우산일 수 있음)' });
    }
});

module.exports = router;