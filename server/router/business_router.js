//영업 router

const express = require('express');
const router = express.Router();

router.get('/business', (req, res) => {
    res.send('business router');
})

module.exports = router;