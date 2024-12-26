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

// 반제품 등록
router.post('/prduct_n_wrhousng', async (req, res) => {
  let Insert = req.body;
  let result = await logistics_service.prduct_n_wrhousng(Insert);
  res.send(result);
});

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
  let result  = await logistics_service.prduct_n_dlivyTest(prdctnNInfo);
  res.send(result);
})

// 반제품 출고 리스트
router.get('/prduct_n_dlivyList', async (req, res) => {
  let searchs = req.query; 
  let prdctn_n_list = await logistics_service.prduct_n_dlivyList(searchs);
  res.send(prdctn_n_list);
})



module.exports = router;  