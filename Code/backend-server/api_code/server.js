const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('백엔드 서버 활성화 (v2)');
});

const usersRouter = require('./routes/users.routes.js');
const umbrellasRouter = require('./routes/umbrellas.routes.js');
const historysRouter = require('./routes/historys.routes.js');
const managersRouter = require('./routes/managers.routes');

app.use('/api/users', usersRouter);
app.use('/api/umbrellas', umbrellasRouter);
app.use('/api/historys', historysRouter);
app.use('/api/managers', managersRouter);

app.listen(port, () => {
    console.log(`서버 로드 완료: http://localhost:${port}`);
});