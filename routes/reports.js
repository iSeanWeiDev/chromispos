var express = require('express');
var router = express.Router();
var inventoryController = require('../controllers/reports/inventoryController');
var getListContorller = require('../controllers/reports/getListController');

router.get('/inventory', inventoryController.getData);
router.get('/categories', getListContorller.getCategoryList);
router.get('/suppliers', getListContorller.getSupplierList);
router.get('/inventory/items/history', inventoryController.getItemSoldHistory);

module.exports = router;
