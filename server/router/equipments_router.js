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

module.exports = router;  

