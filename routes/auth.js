var express = require('express');
var router = express.Router();
var authController = require('../controllers/authController');

/* GET users listing. */
router.post('/login', authController.login);
router.post('/register', authController.register);


module.exports = router;
