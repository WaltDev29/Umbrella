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

//전체 관리자 목록 조회

// 관리자 비밀번호 업데이트
// 3단계에서 호출한 'POST /api/managers/update' 주소를 여기서 받음
router.post('/update', async (req, res) => {

    // 1. 🌟 View가 'body'에 실어 보낸 데이터를 req.body로 꺼냄
    const { manager_old_pw, manager_new_pw } = req.body;

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        // 2. 'SELECT'가 아닌 'UPDATE' 또는 'INSERT' 쿼리 실행
        await connection.execute(
            'UPDATE managers SET manager_pw = ? WHERE manager_pw = ?',
            [manager_new_pw, manager_old_pw]
        );

        res.status(200).json({ success: true, message: '업데이트 성공' });

    } catch (err) {
        res.status(500).json({ message: 'DB 업데이트 실패: ' + err.message });
    } finally {
        if (connection) connection.end();
    }
});

module.exports = router;