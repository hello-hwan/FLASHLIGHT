//설비 router

const express = require('express');
const router = express.Router();
const equipmentsService = require('../service/equipments_service.js');

router.get('/equip/not_sample', async (req, res)=>{
    let searchs = req.query;
    let sample = await equipmentsService.test_sql(searchs);
    res.send(sample);  
  });


module.exports = router;