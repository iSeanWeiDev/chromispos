var express = require('express');
var router = express.Router();
var inventoryController = require('../controllers/reports/inventoryController');
var productSalesController = require('../controllers/reports/productSalesController');
var getListContorller = require('../controllers/reports/getListController');
var stockDiaryController = require('../controllers/reports/stockDiaryController');
var salesByDayController = require('../controllers/reports/salesByDayController');
var salesByMonthController = require('../controllers/reports/salesByMonthController');
var salesByYearController = require('../controllers/reports/salesByYearController');

router.get('/inventory', inventoryController.getData);
router.get('/categories', getListContorller.getCategoryList);
router.get('/suppliers', getListContorller.getSupplierList);
router.get('/inventory/items/history', inventoryController.getItemSoldHistory);
router.get('/productsales', productSalesController.getData);
router.get('/stockdiary', stockDiaryController.getData);
router.post('/stockdiary', stockDiaryController.updateData);
router.get('/salesbyday', salesByDayController.getData);
router.get('/salesbymonth', salesByMonthController.getData);
router.get('/salesbyyear', salesByYearController.getData);

module.exports = router;
