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
    //console.log(requestList);
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

//자재 발주 요청건 리스트
router.get('/mtril/reqOrderList', async (req, res) => {
    let result = await mtrilService.reqMtOrderList();
    res.send(result);
})

//자재 발주완료건 검색
router.post('/mtril/orderList', async (req, res) => {
    let searchInfo = req.body;
    let result = await mtrilService.mtOrderList(searchInfo);
    res.send(result);
});

//발주건별 자재 리스트
router.get('/mtril/mtListOnOrder/:orderCode', async(req, res) => {
    let orderCode = req.params.orderCode;
    let result = await mtrilService.mtListOnOrder(orderCode);
    res.send(result);
});

//발주관리 발주건 자재리스트 입력
router.post('/mtril/insertMtOrderList', async(req, res) => {
    let orderMtList = req.body;
    let result = await mtrilService.insertMtToOrder(orderMtList);
    res.send(result);
})
module.exports = router;