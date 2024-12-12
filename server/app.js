//env 파일 읽기
require('dotenv').config({ path : './database/mariadb.env'});

const express = require('express');
const app = express();

//라우터 모듈 불러오기
const businessRouter = require('./router/business_router.js');
const equipmentsRouter = require('./router/equipments_router.js');
const logisticsRouter = require('./router/logistics_router.js');
const materialsRouter = require('./router/materials_router.js');
const productionRouter = require('./router/production_router.js');
const qualityRouter = require('./router/quality_router.js');
const standardInfoRouter = require('./router/standard_info_router.js');
const statisticsRouter = require('./router/statistics_router.js');

// 미들웨어
app.use(express.json());    //json파서
app.use(express.urlencoded({ extended : false })); //query string 파서

app.listen(3000, ()=>{
    console.log('Server Start');
    console.log('http://localhost:3000');
});

app.get('/', (req, res)=>{
    res.send('Welcome!!');
});


/* 
    라우터 불러오는 부분입니다. 
*/

//영업
app.use('/', businessRouter);

//설비
app.use('/', equipmentsRouter);

//물류
app.use('/', logisticsRouter);

//자재
app.use('/', materialsRouter);

//생산
app.use('/', productionRouter);

//품질
app.use('/', qualityRouter);

//기준정보
app.use('/', standardInfoRouter);

//통계
app.use('/', statisticsRouter);