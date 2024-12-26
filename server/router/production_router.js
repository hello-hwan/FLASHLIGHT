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

// 생산지시 조회
router.get('/prod/drctlist', async (req, res) => {
  let prd_code = req.query.prd_code;
  let day_str = req.query.day_str;
  
  prodService
  .drctlist(prd_code, day_str)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 설비 조회(테이블 왼쪽 헤드)
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

// 제품명 조회(검색시 필요)
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

// 자재 부족 조회
router.get('/prod/reqlist', async (req, res) => {
  prodService
  .reqlist()
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 자재 부족 발주 요청
router.put('/prod/requpdate/:code', async(req, res) => {
  let code = req.params.code;
  let qy = req.body.qy;
  prodService
  .requpdate(code, qy)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 자체 생산 추가
router.post('/prod/insertdrct', async (req, res) => {
  let code = req.params.code;
  let qy = req.params.qy;
  let dedt = req.params.dedt;
  prodService
  .drctinsert(code, qy, dedt)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 키오스크 생산지시 조회 - 당일 조회
router.get('/prod/drcttoday', async (req, res) => {
  prodService
  .finddrct()
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 생산지시 단건 조회 - 키오스크 시작보고
router.get('/prod/onedrct/:code', async (req, res) => {
  let code = req.params.code;
  prodService
  .drctinfo(code)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 소모재료 조회 - 키오스크 시작보고
router.get('/prod/selmatrl/:code', async (req, res) => {
  let code = req.params.code;
  prodService
  .selmatrl(code)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 생산실적 삽입 - 키오스크 시작보고 버튼
router.post('/prod/addstate', async (req, res) => {
  let array = [];
  
  prodService
  .addstate(array)
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