//자재 router
const express = require('express');
const router = express.Router();
const mtrilService = require('../service/materials_service.js');

//반환 자재 리스트
router.get('/mtril/returnMt', async (req, res)=>{
    let returnList = await mtrilService.returnMt();
    //console.log(returnList);
    res.send(returnList);
});

//주문 자재 리스트
router.get('/mtril/orderMt', async (req,res)=>{
    let orderList = await mtrilService.orderMt();
    //console.log(orderList);
    res.send(orderList);
});

//입고 등록
router.post('/mtril/mtWrhous', async(req, res) => {
    let wrInfo = req.body;
    let result = await mtrilService.insertMtWrhous(wrInfo);
    res.send(result);
});

//출고 요청 요청명
router.get('/mtril/mtRequest', async(req, res) => {
    let requestList = await mtrilService.requestList();
    console.log(requestList);
    res.send(requestList);
});

//출고 요청명별 자재 리스트 조회
router.get('/mtril/mtRequestDetails/:code', async (req,res)=>{
    let reqCode = req.params.code;
    let info = await mtrilService.requestMt(reqCode);
    res.send(info);
});

//출고 등록 후 처리 여부 업데이트
router.post('/mtril/mtDlivy', async (req,res)=>{
    let dlivyInfo = req.body;
    let result = await mtrilService.dlivyMt(dlivyInfo);        
    res.send(result);
});
module.exports = router;