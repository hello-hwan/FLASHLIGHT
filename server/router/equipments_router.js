//설비 router

const express = require('express');
const router = express.Router();
const equipmentsService = require('../service/equipments_service.js');

router.get('/equip/eqp_list', async (req, res) => {
    let list = await equipmentsService.eqp_list();
    res.send(list);
});

module.exports = router;  

