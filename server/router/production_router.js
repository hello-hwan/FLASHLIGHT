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
router.get('/prod/prdlist', async (req, res) => {
  let name = req.query.name;
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
router.get('/prod/selmatrl', async (req, res) => {
  let array = [];
  array.push(req.query.prdctn_code);
  array.push(req.query.mnfct_no);
  prodService
  .selmatrl(array)
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
  array.push(req.body.prdctn_code);
  array.push(req.body.procs_nm);
  array.push(req.body.prd_code);
  array.push(req.body.prdctn_co);
  array.push(req.body.eqp_code);
  array.push(req.body.begin_time);
  array.push(parseInt(req.body.empl_no));
  prodService
  .addstate(array)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 생산 실적 단건조회 - 키오스크 완료 보고
router.get('/prod/stateinfo/:code', async (req, res) => {
  let code = req.params.code;
  prodService
  .stateinfo(code)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 불량품 정보 삽입 - 키오스크 완료보고
router.post('/prod/addbad', async (req, res) => {
  let array = [];
  array.push(parseInt(req.body.badn_qy));
  array.push(req.body.badn_ty);
  array.push(req.body.prdctn_code);
  prodService
  .addbad(array)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 생산 완료 보고 - 키오스크 완료보고 - 재료 없을 때
router.put('/prod/updstate/no', async (req, res) => {
  let array = [];
  array.push(req.body.end_time);
  array.push(req.body.nrmlt);
  array.push(req.body.prdctn_code);
  prodService
  .finnomt(array)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 생산 완료 보고 - 키오스크 완료보고 - 재료 있을 때
router.put('/prod/updstate/yes', async (req, res) => {
  let code = req.body.prdctn_code;
  let matril = req.body.matril;
  prodService
  .finyesmt(code, matril)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 공장 실적 조회
router.get('/prod/statelist', async (req, res) => {
  let array = [];
  array.push(req.query.procs_code);
  array.push(req.query.empl_no);
  array.push(req.query.end_date);
  prodService
  .statelist(array)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })

});

// 공정이동표 조회 - 키오스크
router.get('/prod/shiftlist', async (req, res) => {
  let array = [];
  array.push(req.query.prd_code);
  array.push(req.query.order_no);
  prodService
  .shiftlist(array)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

// 공정현황 조회 - 메인페이지
router.get('/prod/drcttable', async (req, res) => {
  let array = [];
  array.push(req.query.code);
  array.push(req.query.day);
  array.push(req.query.day);
  array.push(req.query.day);
  array.push(req.query.day);
  array.push(req.query.day);
  array.push(req.query.day);
  prodService
  .drcttable(array)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

router.get('/prod/procslist', async (req, res) => {
  let name = req.query.name;
  prodService
  .procslist(name)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

module.exports = router;