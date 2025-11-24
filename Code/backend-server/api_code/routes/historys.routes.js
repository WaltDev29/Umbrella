const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM history ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '히스토리 목록 조회 실패' });
    }
});

router.get('/umbrella/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM history WHERE umbrella_id = ? ORDER BY created_at DESC',
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '우산 이력 조회 실패' });
    }
});

router.get('/user/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC',
            [req.params.id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '사용자 이력 조회 실패' });
    }
});

module.exports = router;