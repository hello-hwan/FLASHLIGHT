//품질 router
//품질검사요청
const express = require('express');
const router = express.Router();
const qualityService = require('../service/quality_service.js')

router.get('/quality/qualityRequest', async(req, res) =>{
    let reNo = req.query.re_info;    
    let result = await qualityService.qualityRequest(reNo);
    res.send(result);
});

module.exports = router;