//자재 router
const express = require('express');
const router = express.Router();
const mtrilService = require('../service/materials_service.js');

//반환 자재 리스트
router.get('/returnMt', async (req, res)=>{
    let returnList = await mtrilService.returnMt();
    //console.log(returnList);
    res.send(returnList);
});

//주문 자재 리스트
router.get('/orderMt', async (req,res)=>{
    let orderList = await mtrilService.orderMt();
    console.log(orderList);
    res.send(orderList);
});

//입고 등록
router.post('/mtWrhous', async(req, res) => {
    let wrInfo = req.body;
    let result = await mtrilService.insertMtWrhous(wrInfo);
    res.send(result);
});

//출고 요청 자재리스트
router.get('/mtReq', async(req, res) => {
    
});
module.exports = router;