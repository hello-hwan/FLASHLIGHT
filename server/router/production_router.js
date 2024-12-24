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

router.get('/prod/eqplist', async (req, res) => {
  prodService
  .eqplist()
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

router.get('/prod/prdlist/:name', async (req, res) => {
  let name = req.params.name;
  prodService
  .prdlist(name)
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

//------------------------------------- 실험용 코드 생산일정(매개변수 컨트롤 해야함)

router.get('/prod/seldrct', async (req, res) => {
  let prd_code = req.body.prd_code;
  let day_str = req.body.day_str;
  
  prodService.seldrct(prd_code, day_str).then(list => {res.send(list)})
  .catch(err => {res.status(500).send('Fail Process')})
});

module.exports = router;