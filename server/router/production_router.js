//생산 router

const express = require('express');
const router = express.Router();
const prodService = require('../service/production_service.js');

router.get('/prod/search', async (req, res) => {
    prodService
    .findcmmn()
    .then(list => {
      res.send(list);
    })
    .catch(err => {
      res.status(500).send('Fail Process');
    })  
});

router.get('/prod/flowchart/:code', async (req, res) => {
  let code = req.params.code;
  prodService
  .searchflowchart(code)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

router.get('/prod/order', async (req, res) => {
  prodService
  .searchorder()
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

router.get('/prod/usetime/:code', async (req, res) => {
  let code = req.params.code;
  prodService
  .searchtime(code)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
});

router.get('/prod/useqy/:code', async (req, res) => {
  let code = req.params.code;
  prodService
  .searchuseqy(code)
  .then(list => {
    res.send(list);
  })
  .catch(err => {
    res.status(500).send('Fail Process');
  })
})

module.exports = router;