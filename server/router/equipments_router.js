//설비 router

const express = require('express');
const router = express.Router();
const equipmentsService = require('../service/equipments_service.js');

//설비 상태 조회
router.get('/equip/eqp_list', async (req, res) => {
    let list = await equipmentsService.eqp_list();
    res.send(list);
});

// 설비 상태 조회 2
router.get('/equip/eqp_list_prod/:eqp_code', async (req, res) => {
    let eqp_code = req.params.eqp_code;
    let list = await equipmentsService.eqp_list_prod(eqp_code);
    res.send(list);
});

// 점검할 기기 조회
router.get('/equip/chck_fx_list', async (req, res) => {
    let list = await equipmentsService.chck_fx_list();
    res.send(list);
});

// 전체 점검 기기 조회
router.get('/equip/chck_fx_all_list', async (req, res) => {
    let list = await equipmentsService.chck_fx_all_list();
    res.send(list);
});

// 일정코드로 점검일정 조회
router.get('/equip/fx_code_list/:fx_code', async (req, res) => {
    let fx_code = req.params.fx_code;
    let list = await equipmentsService.fx_code_list(fx_code);
    res.send(list);
});

// 점검 일정 등록
router.post('/equip/chck_fc_insert', async(req, res)=>{
  let list = req.body;
  let result = await equipmentsService.chck_fc_insert(list);
  res.send(result);
});

// 점검 결과 등록
router.post('/equip/chck_result_insert', async(req, res)=>{
    let list = req.body;
    let result = await equipmentsService.chck_result_insert(list);
    res.send(result);
});

// 점검 결과 등록할 일정 코드 찾기
router.get('/equip/find_last_fx_code', async (req, res) => {
    let list = await equipmentsService.find_last_fx_code();
    res.send(list);
});

// 미점검 업데이트
router.put('/equip/not_check_update', async (req, res) => {
    let list = req.body;
    let result = await equipmentsService.not_check_update(list);
    res.send(result);
});

// 점검 항목 조회
router.get('/equip/chck_iem_list/:eqp_code', async (req, res) => {
    let eqp_code = req.params.eqp_code;
    let list = await equipmentsService.chck_iem_list(eqp_code);
    res.send(list);
});

module.exports = router;  

