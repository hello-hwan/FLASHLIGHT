//품질 router
//품질검사요청
const express = require('express');
const router = express.Router();
const qualityService = require('../service/quality_service.js')

/*태백 작업 */

//자재 발주 목록 가져오기(검사 완료 항목 제외)
router.post('/quality/mtrilOrderList', async(req, res) =>{
    let orderInfo = req.body;    
    let result = await qualityService.mtrilOrderList(orderInfo)
                                     .catch(err => console.log(err));
    res.send(result);
});

//발주건 자재 목록 가져오기
router.get('/quality/mtrilList/:orderCode', async(req, res) =>{
    let ordercode = req.params.orderCode;    
    let result = await qualityService.mtrilList(ordercode)
                                     .catch(err => console.log(err));
    res.send(result);
});

//입고 검사 결과 등록하기
router.post('/quality/insertQiList', async(req, res) => {
    let insInfo = req.body;
    let result = await qualityService.insertResult(insInfo)
                                     .catch(err => console.log(err));
    res.send(result);
});

//검사결과조회
router.post('/quality/qiResult', async(req, res) =>{
    let searchKey = req.body;    
    let result = await qualityService.qiResultList(searchKey)
                                     .catch(err => console.log(err));
    res.send(result);
});


module.exports = router;