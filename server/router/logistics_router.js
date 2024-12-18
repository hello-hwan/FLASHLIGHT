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


module.exports = router; 