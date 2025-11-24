const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT manager_id, manager_tel, manager_created FROM managers');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '관리자 목록 로드 실패' });
    }
});

router.post('/auth', async (req, res) => {
    const { manager_tel, manager_pw } = req.body;
    try {
        const [rows] = await pool.query(
            'SELECT manager_id, manager_tel FROM managers WHERE manager_tel = ? AND manager_pw = ?',
            [manager_tel, manager_pw]
        );
        if (rows.length === 0) return res.status(401).json({ message: '관리자 정보 불일치' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB 오류' });
    }
});

router.post('/update', async (req, res) => {
    const { manager_old_pw, manager_new_pw } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE managers SET manager_pw = ? WHERE manager_pw = ?',
            [manager_new_pw, manager_old_pw]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: '기존 비밀번호가 일치하지 않거나 변경되지 않았습니다.' });
        }
        res.json({ success: true, message: '업데이트 성공' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'DB 업데이트 실패' });
    }
});

module.exports = router;