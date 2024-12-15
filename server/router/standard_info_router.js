//기준정보 router

const express = require('express');
const router = express.Router();
const standard_info_service = require('../service/standard_info_service.js');

// 기준정보 데이터 select 테스트
router.get('/cmmn', async (req, res)=>{
  let searchs = req.query;
  let cmmnList = await standard_info_service.cmmntest(searchs);
  res.send(cmmnList);
});

// BOM 데이터 select 테스트
router.get('/bom', async (req, res) => {
  let searchs = req.query;
  let bomlist = await standard_info_service.bomtest(searchs);
  res.send(bomlist);
});
 
// BOM 상세조회 
router.get('/bom/:bomCode', async (req, res) => {
  let bomCode = req.params.bomCode;
  let info = await standard_info_service.bomInfo(bomCode); 
  res.send(info);
});
 
// BOM 등록
router.post('/bom', async (req, res) => {
  let bominfo = req.body;
  let result = await standard_info_service.bomInsert(bominfo);
  res.send(result);
})
 
module.exports = router;   