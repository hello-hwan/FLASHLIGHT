//품질 router
//품질검사요청
const express = require('express');
const router = express.Router();
const qualityService = require('../service/quality_service.js')

//발주요청
router.get('/quality/order_request', async(req, res) =>{
    let reNo = req.query.mt_info;    
    let result = await qualityService.order_request(reNo).catch(err => console.log(err));
    res.send(result);
});

//검사항목
router.get('/quality/inspec_item', async(req, res) =>{
    let reNo = req.query.in_info;    
    let result = await qualityService.inspec_item(reNo);
    res.send(result);
});

//등록
router.post(`/quality/quailtyInsert`, async(req, res) =>{
    let order_request=req.body;
    console.log(order_request);
    let result = await qualityService.quailtyInsert(order_request);
    res.send(result);


});
//
module.exports = router;