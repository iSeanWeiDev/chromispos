var express = require('express');
var router = express.Router();
var reportsController = require('../controllers/admin/reportsController');
var userController = require('../controllers/admin/usersController');

router.post('/reports', reportsController.saveReport);
router.put('/reports', reportsController.updateReport);
router.delete('/reports', reportsController.deleteReport);
router.post('/users', userController.createAccount);
router.put('/users/', userController.changePassword);
router.delete('/users', userController.deleteAccount);

module.exports = router;
