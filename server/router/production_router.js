//생산 router

const express = require('express');
const router = express.Router();
const prodService = require('../service/production_service.js');

// 공통 코드 조회
router.get('/prod/search/:code', async (req, res) => {
  let code = req.params.code;
    prodService
    .findcmmn(code)
    .then(list => {
      res.send(list);
    })
    .catch(err => {
      res.status(500).send('Fail Process');
    })  
});

router.get('/prod/drctlist', async (req, res) => {
  prodService
  .drctlist()
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});


// ----------------------  프로시저 만들기 전의 코드(서비스에서 제어하려고 한 코드)

router.get('/prod/total', async (req, res) => {
  prodService.total().then(list => {
    res.send(list);
  }).catch(err => {
    res.status(500).send('Fail Process');
  })
});
module.exports = router;