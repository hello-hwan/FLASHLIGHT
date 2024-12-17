//영업 router

const express = require('express');
const router = express.Router();
const businessService = require('../service/business_service.js');

/*
router.get('/business', (req, res) => {
    res.send('business router');
})
*/

// 주문요청 조회
router.get('/business/orderList', async (req, res) => {
    let searchs = req.query;
    let businessList = await businessService.findAllOrderRequest(searchs);
    res.send(businessList);
});

//주문 요청 등록
router.post('/business/orderForm', async (req, res) => {
    let orderRequestInfo = req.body;
    let result = await businessService.createNewOrderRequest(orderRequestInfo);
    res.send(result);
});

// 주문 요청 리스트 등록
router.post('/business/orderForm', async (req, res) => {
    let orderRequestListInfo = req.body;
    let result = await businessService.createNewOrderList(orderRequestListInfo);
    res.send(result);
});

module.exports = router;

