//기준정보 router

const express = require('express');
const router = express.Router();
const standard_info_service = require('../service/standard_info_service.js');

router.get('/cmmn', async (req, res)=>{
  let searchs = req.query;
  let cmmnList = await standard_info_service.cmmntest(searchs);
  res.send(cmmnList);
});

module.exports = router;