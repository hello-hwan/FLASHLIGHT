//품질 router
//품질검사요청
const express = require('express');
const router = express.Router();
const qualityService = require('../service/quality_service.js')

//품질입고검사
router.get('/quality/inspec_prd', async(req, res) =>{
    let reNo = req.query.re_info;    
    let result = await qualityService.inspec_prd(reNo);
    res.send(result);
});

//품질입고검사등록
router.post('/inspecInsert',async(req,res)=>{
    let Insert = req.body;
    let result = await qualityService.inspecInsert(Insert);
    res.send(result);
});


//
module.exports = router;