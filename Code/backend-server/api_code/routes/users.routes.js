const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error("SQL Error in GET /api/users:", error);
        res.status(500).json({ success: false, message: '사용자 목록 조회 실패' });
    }
});

router.post('/', async (req, res) => {
    const { user_tel, user_pw } = req.body;

    try {
        const [exists] = await pool.query('SELECT user_id FROM users WHERE user_tel = ?', [user_tel]);
        if (exists.length > 0) {
            return res.status(409).json({ success: false, message: '이미 등록된 전화번호입니다.' });
        }

        const [result] = await pool.query(
            'INSERT INTO users (user_tel, user_pw, created_at) VALUES (?, ?, NOW())',
            [user_tel, user_pw]
        );

        const [rows] = await pool.query(
            'SELECT user_id, user_tel, created_at FROM users WHERE user_id = ?',
            [result.insertId]
        );

        if (rows.length === 0) {
            return res.status(500).json({ success: false, message: '사용자 생성 후 조회 실패' });
        }

        res.status(201).json(rows[0]);

    } catch (error) {
        console.error("SQL Error in POST /api/users:", error);
        res.status(500).json({ success: false, message: '사용자 등록 중 서버 DB 처리 오류 발생' });
    }
});

router.post('/auth', async (req, res) => {
    const { user_tel, user_pw } = req.body;

    try {
        const [rows] = await pool.query(
            'SELECT user_id, user_tel, created_at FROM users WHERE user_tel = ? AND user_pw = ?',
            [user_tel, user_pw]
        );

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: '사용자 정보가 일치하지 않습니다.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("SQL Error in POST /api/users/auth:", error);
        res.status(500).json({ success: false, message: '사용자 인증 중 서버 DB 처리 오류 발생' });
    }
});

module.exports = router;