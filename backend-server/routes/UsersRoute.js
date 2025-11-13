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

//==================== 사용자 정보 API ====================
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT user_id, user_tel, created_at FROM users');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: '사용자 목록 로드 실패.' });
    } finally {
        if (connection) connection.end();
    }
});

router.post('/', async (req, res) => {
    const { user_tel, user_pw } = req.body;
    const tel1 = /^01[016789]-\d{3,4}-\d{4}$/;
    const tel2 = /^01[016789]\d{7,8}$/;
    if (!(tel1.test(user_tel) || tel2.test(user_tel))) return res.status(400).json({ message: '전화번호 형식 오류' });
    if (!/^\d{4}$/.test(user_pw)) return res.status(400).json({ message: 'PIN 오류' });
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO users (user_tel, user_pw, created_at) VALUES (?, ?, NOW())',
            [user_tel, user_pw]
        );
        res.status(201).json({ user_id: result.insertId, user_tel, user_pw, created_at: new Date() });
    } catch (err) {
        res.status(500).json({ message: 'DB 오류' });
    } finally {
        if (connection) connection.end();
    }
});

router.post('/auth', async (req, res) => {
    const { user_tel, user_pw } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE user_tel=? AND user_pw=?',
            [user_tel, user_pw]
        );
        if (rows.length === 0) return res.status(404).json(null);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'DB 오류' });
    } finally {
        if (connection) connection.end();
    }
});

module.exports = router;
