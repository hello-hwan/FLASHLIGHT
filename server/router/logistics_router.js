//물류 router

const express = require('express');
const router = express.Router();
const logistics_service = require('../service/logistics_service.js');

// 반제품 입고 리스트
router.get('/prdctn_n_list', async (req, res) => {
  let searchs = req.query; 
  let prdctn_n_list = await logistics_service.prdctn_n_list(searchs);
  res.send(prdctn_n_list);
})

// 반제품 반환 입고 리스트
router.get('/prdctn_n_return_list', async (req, res) => {
  let searchs = req.query;
  let prdctn_n_return_list = await logistics_service.prdctn_n_return_list(searchs);
  res.send(prdctn_n_return_list);
})

// 반제품 입고 등록
router.post('/prduct_n_wrhousng', async (req, res) => {
  let Insert = req.body;
  let result = await logistics_service.prduct_n_wrhousng(Insert);
  res.send(result);
});

// 반제품 반환 입고 등록
router.post('/prduct_n_wrhousngReturn', async (req,res) => {
  let Insert = req.body;
  let result = await logistics_service.prduct_n_wrhousngReturn(Insert);
  res.send(result);
})

// 반제품 반환입고 후 반제품 출고 테이블 업데이트
router.put('/prduct_n_dlivyReturn/:lot', async (req, res) => {
  let lot = req.params.lot;
  let result = await logistics_service.prduct_n_dlivyReturn(lot);
  res.send(result);
})

// 반제품 입고 완료 리스트
router.get('/prdctnNList', async (req, res) => {
  let searchs = req.query;
  let prdctNList = await logistics_service.prdctNList(searchs);
  res.send(prdctNList);
})

// 반제품 출고 리스트
router.get('/prduct_n_dlivy', async (req, res) => {
  let searchs = req.query;
  let prduct_n_dlivy = await logistics_service.prduct_n_dlivy(searchs);
  res.send(prduct_n_dlivy);
})

//반제품 출고가능 제품
router.get('/prduct_n_possible/:prdCode', async(req, res) => {
  let prdCode = req.params.prdCode;
  let prduct_n_possible = await logistics_service.prduct_n_possible(prdCode);
  res.send(prduct_n_possible);
})

// 반제품 출고완료처리
router.post('/prduct_n_dlivyTest', async(req, res) => {
  let prdctnNInfo = req.body;
  console.log('router',prdctnNInfo);
  let result  = await logistics_service.prduct_n_dlivyTest(prdctnNInfo);
  res.send(result);
})
  
// 반제품 출고 리스트
router.get('/prduct_n_dlivyList', async (req, res) => {
  let searchs = req.query; 
  let prdctn_n_list = await logistics_service.prduct_n_dlivyList(searchs);
  res.send(prdctn_n_list);
})

// 반제품 출고 상세 리스트
router.get('/prductNDlivyListInfo/:code', async (req, res) => {
  let code = req.params.code;
  let prductNDlivyListInfo = await logistics_service.prductNDlivyListInfo(code);
  res.send(prductNDlivyListInfo);
})

// 완제품 입고대기 리스트(일반)
router.get('/prductList', async (req, res) => {
  let searchs = req.query;
  let prductList = await logistics_service.prductList(searchs);
  res.send(prductList);
})


// 완제품 등록
router.post('/prductWrhousng', async (req, res) => {
  let Insert = req.body;
  console.log(Insert);
  let result = await logistics_service.prductWrhousng(Insert);
  res.send(result);
});


// 완제품 입고완료 리스트
router.get('/prductWrhousngList', async (req, res) => {
  let searchs = req.query;
  let prductWrhousngList = await logistics_service.prductWrhousngList(searchs);
  res.send(prductWrhousngList);
})

// 완제품 출고 요청 리스트
router.get('/prduct_possible', async (req, res) => {
  let searchs = req.query;
  let prduct_possible = await logistics_service.prduct_possible(searchs);
  res.send(prduct_possible);
})

// 완제품 출고 가능제품 리스트
router.get('/prduct_possible_dlivy/:code', async (req, res) => {
  let code = req.params.code;
  let prduct_possible_dlivy = await logistics_service.prduct_possible_dlivy(code);
  res.send(prduct_possible_dlivy);
})

// 완제품 출고완료처리
router.post('/prduct_dliy_process', async(req, res) => {
  let prdctnInfo = req.body;
  console.log('router',prdctnInfo);
  let result  = await logistics_service.prduct_dliy_process(prdctnInfo);
  res.send(result);
})

// 완제품 출고 완료 요청리스트
router.get('/prduct_dlivyList', async (req, res) => {
  let searchs = req.query;
  let prduct_dlivyList = await logistics_service.prduct_dlivyList(searchs);
  res.send(prduct_dlivyList);
})

// 완제품 출고 완료 상세리스트
router.get('/prductDlivyListInfo/:code', async (req, res) => {
  let code = req.params.code;
  let prductDlivyListInfo = await logistics_service.prductDlivyListInfo(code);
  res.send(prductDlivyListInfo);
})

module.exports = router;  