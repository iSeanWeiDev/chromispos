var express = require('express');
var router = express.Router();
var reportsController = require('../controllers/admin/reportsController');

router.post('/reports', reportsController.saveReport);
router.put('/reports', reportsController.updateReport);
router.delete('/reports', reportsController.deleteReport);

module.exports = router;
