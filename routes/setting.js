var express = require('express');
var router = express.Router();
var settingController = require('../controllers/settingController');

router.post('', settingController.saveConnection);
router.delete('', settingController.deleteConnection);

module.exports = router;
