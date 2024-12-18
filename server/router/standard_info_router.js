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

// BOM 조회
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
 
// BOM소모품 등록
router.post('/bom', async (req, res) => {
  let bominfo = req.body;
  console.log('router',bominfo); 
  let result = await standard_info_service.bomInsert(bominfo);
  res.send(result);
});



// 품질검사항목관리
router.get('/standardInfo/qiList', async (req, res) => {
  let qiNo = req.query.qi_info; // key=value => req.query.key;
  console.log(req.query, qiNo);
  let result = await standard_info_service.qiList(qiNo);
  res.send(result);
});
 
// 공정 흐름도 조회
router.get('/procsFlowchartList', async (req, res) => {
    let list = await standard_info_service.procsFlowchartList();
    res.send(list);
});

// 공정 흐름도 상세 조회
router.get('/procsFlowchartDetail/:prd_code', async (req, res) => {
  let prd_code = req.params.prd_code;
  let list = await standard_info_service.procsFlowchartDetail(prd_code);
  res.send(list);
});
 
module.exports = router;     