var express = require('express');
var router = express.Router();
var stockDiaryController = require('../controllers/mobile/stockDiaryController');

router.get('/stockdiary', stockDiaryController.getData);
router.post('/stockdiary', stockDiaryController.updateData);

module.exports = router;
