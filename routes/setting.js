var express = require('express');
var router = express.Router();
var settingController = require('../controllers/settingController');

router.post('', settingController.saveConnection);

module.exports = router;
