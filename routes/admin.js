var express = require('express');
var router = express.Router();
var reportsController = require('../controllers/admin/reportsController');

router.post('/reports', reportsController.saveReport);

module.exports = router;
