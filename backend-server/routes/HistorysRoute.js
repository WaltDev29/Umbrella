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
// 전체 이력 조회
router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM history');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: '이력 로드 실패.' });
    } finally {
        if (connection) connection.end();
    }
});

// 우산별 이력
router.get('/umbrella/:umbrella_id', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM history WHERE umbrella_id=?', [req.params.umbrella_id]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: '이력 로드 실패.' });
    } finally {
        if (connection) connection.end();
    }
});

// 사용자별 이력
router.get('/user/:user_id', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM history WHERE user_id=?', [req.params.user_id]);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: '이력 로드 실패.' });
    } finally {
        if (connection) connection.end();
    }
});
module.exports = router;
