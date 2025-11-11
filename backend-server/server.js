// server.js 파일 (수정 완료)

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 5000; // 백엔드 서버 포트

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 본문 파싱

// 1. MySQL 연결 설정 (DB 정보)
const dbConfig = {
    host: '192.168.24.156',
    user: 'team_user',
    password: '1234',
    database: 'umbrella',
    port: 3306
};

// 헬스 체크 엔드포인트
app.get('/', (req, res) => {
    res.send('백엔드 서버 활성화.');
});

// 2. [API #1] 모든 사용자 목록 조회
app.get('/api/users', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT user_id, user_tel, created_at FROM users');
        res.status(200).json(rows);
    } catch (error) {
        console.error('API /api/users 오류:', error);
        res.status(500).send({ message: '사용자 목록 로드 실패.' });
    } finally {
        if (connection) connection.end(); // 연결 해제
    }
});


// 3. [API #4] 모든 테이블 데이터를 동적으로 조회 (워크벤치 기능)
app.get('/api/table/:tableName', async (req, res) => {
    let connection;
    try {
        const tableName = req.params.tableName; // 테이블 이름 파라미터

        // 보안 조치: 허용된 테이블만 접근 가능하도록 검증
        const allowedTables = ['users', 'umbrellas', 'history', 'managers'];
        if (!allowedTables.includes(tableName)) {
            return res.status(400).send({ message: `허가되지 않은 테이블 이름입니다. (가능: ${allowedTables.join(', ')})` });
        }

        connection = await mysql.createConnection(dbConfig);

        // SELECT * FROM [테이블이름] 쿼리 실행 (보안 검증 후 동적 쿼리 사용)
        const query = `SELECT * FROM ${tableName}`;
        const [rows] = await connection.execute(query);

        res.status(200).json({
            tableName: tableName,
            data: rows
        });

    } catch (error) {
        console.error(`API /api/table/${req.params.tableName} 오류:`, error);
        res.status(500).send({ message: '데이터 조회 실패.' });
    } finally {
        if (connection) connection.end();
    }
});


// 서버 시작
app.listen(port, () => {
    console.log(`서버 로드 완료: http://localhost:${port}`);
});