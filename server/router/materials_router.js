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
});

//발주건 삭제
router.delete('/mtril/deleteOrder/:orderCode', async(req, res) => {
    let orderCode = req.params.orderCode;
    let result = await mtrilService.mtOrderDelete(orderCode);
    res.send(result);
});

//발주건 수정
router.post('/mtril/modifyOrderList', async(req, res) => {
    let modifyInfo = req.body;
    let result = await mtrilService.mtOrderModify(modifyInfo);
    res.send(result);
})

//자재 검색 모달 - 자재 검색하기
router.post('/mtril/searchMt', async(req, res) => {
    let searchMtKey = req.body;
    let result = await mtrilService.searchMtModal(searchMtKey);
    res.send(result);
});

//거래처 검색 모달 - 거래처 검색하기
router.post('/mtril/searchCompany', async(req, res) => {
    let searchCompanyKey = req.body;
    let result = await mtrilService.searchCompanyModal(searchCompanyKey)
    res.send(result);
});

//자재 재고 조회
router.get('/mtril/mtAllQy', async(req, res) => {
    let result = await mtrilService.allMtQy();
    res.send(result);
});

//로트별 자재 재고 조회
router.post('/mtril/lot', async(req, res) => {
    let searchKey = req.body;
    let result = await mtrilService.mtLotQy(searchKey);
    res.send(result);
});

//자재 발주조회
router.post('/mtril/allOrderList', async(req, res) => {
    let searchKey = req.body;
    let result = await mtrilService.allOrderList(searchKey);
    res.send(result);
});

//자재 입고조회
router.post('/mtril/wrhousingList', async(req, res) => {
    let searchKey = req.body;
    let result = await mtrilService.wrhousingList(searchKey);
    res.send(result);
});

//자재 출고 조회
router.post('/mtril/dlivyList', async(req, res) => {
    let searchKey = req.body;
    let result = await mtrilService.dlivyList(searchKey);
    res.send(result);
});

//발주서
router.get('/mtril/orderForm/:orderCode', async(req, res) => {
    let orderCode = req.params.orderCode;
    let result = await mtrilService.orderForm(orderCode);
    res.send(result);
});

//발주서 뽑을때 필요한 모든 발주목록
router.post('/mtril/allOrderListForPDF', async(req, res) => {
    let searchKey = req.body;
    let result = await mtrilService.allOrderListForPDF(searchKey);
    res.send(result);
});
router.post
module.exports = router;