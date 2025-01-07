//env 파일 읽기
require('dotenv').config({ path : './database/mariadb.env'});

const express = require('express');
const app = express();
const path = require("path");
const history = require("connect-history-api-fallback");

//라우터 모듈 불러오기
const businessRouter = require('./router/business_router.js');
const equipmentsRouter = require('./router/equipments_router.js');
const logisticsRouter = require('./router/logistics_router.js');
const materialsRouter = require('./router/materials_router.js');
const productionRouter = require('./router/production_router.js');
const qualityRouter = require('./router/quality_router.js');
const standardInfoRouter = require('./router/standard_info_router.js');
const statisticsRouter = require('./router/statistics_router.js');

//새로고침, 라우터 이동 가능하게 만듦.
app.use(history()); //라우터보다 먼저 실행되야함

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

/*
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
*/

// 미들웨어
app.use(express.json());    //json파서
app.use(express.urlencoded({ extended : false })); //query string 파서

app.use(express.static(path.join(__dirname, 'public')));

app.set("port", process.env.PORT || 3000);

app.listen(3000, ()=>{
    console.log('Server Start');
    console.log('http://localhost:3000');
});

/* 
    라우터 불러오는 부분입니다. 
*/

//영업
app.use('/api', businessRouter);

//설비
app.use('/api', equipmentsRouter);

//물류
app.use('/api', logisticsRouter);

//자재
app.use('/api', materialsRouter);

//생산
app.use('/api', productionRouter);

//품질
app.use('/api', qualityRouter);

//기준정보
app.use('/api', standardInfoRouter);

//통계
app.use('/api', statisticsRouter);