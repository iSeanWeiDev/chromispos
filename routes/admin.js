var express = require('express');
var router = express.Router();
var reportsController = require('../controllers/admin/reportsController');

router.post('/', reportsController.saveReport);

module.exports = router;
