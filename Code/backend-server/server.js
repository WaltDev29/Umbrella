const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// ===================== 헬스체크 =====================
app.get('/', (req, res) => {
    res.send('백엔드 서버 활성화.');
});

// ===================== 도메인별 라우터 등록 =====================
const usersRouter = require('./routes/UsersRoute.js');
const umbrellasRouter = require('./routes/umbrellasRoute.js');
const historysRouter = require('./routes/HistorysRoute.js');
const managersRouter = require('./routes/ManagersRoute.js');

app.use('/api/users', usersRouter);
app.use('/api/umbrellas', umbrellasRouter);
app.use('/api/historys', historysRouter);
app.use('/api/managers', managersRouter);

// ===================== 글로벌 에러 핸들러 =====================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

app.listen(port, () => {
    console.log(`서버 로드 완료: http://localhost:${port}`);
});
