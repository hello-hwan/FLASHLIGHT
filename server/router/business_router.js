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

// 주문번호 생성
router.get('/business/orderArray', async (req, res) => {
    let query = req.query;
    let orderArrayNoList = await businessService.findOrderArray(query);
    res.send(orderArrayNoList);
})

// 주문요청 상세조회
router.get('/business/orderList/:order_no', async (req, res) => {
    let orderNo = req.params.order_no; 
    //let searchs = req.query;
    let orderInfo = await businessService.findOrderRequestByNo(orderNo);
    res.send(orderInfo);
});

// 주문 요청과 주문리스트 등록
router.post('/business/orderForm', async (req,res)=>{
    let orderRequestInfo = req.body;
    console.log(orderRequestInfo);
    let result = await businessService.createNewOrderRequest(orderRequestInfo);
    res.send(result);
});

// 주문 요청 삭제
router.delete('/business/orderInfo/:order_no',async(req,res)=>{
    let order_no = req.params.order_no;
    let result = await businessService.deleteOrderRequestByOrderNo(order_no);
    res.send(result);
});

// 거래처 검색
router.post('/business/searchCompany', async(req,res)=>{
    let searchCompanyKey = req.body;
    let result = await businessService.searchCompanyModal(searchCompanyKey);
    res.send(result);
})

module.exports = router;

