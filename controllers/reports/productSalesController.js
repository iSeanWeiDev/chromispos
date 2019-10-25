var mysql = require('mysql2');
var queryList = require('../../database/queries/productSales');
var sqliteService = require('../../services/sqlite');

var productSalesController = {
  getData: (req, res) => {
    sqliteService.getDbInfoByName(req.query.hostName, cb => {
      var dbInfo = cb;

      if (req.query.categoryID == 'all' && req.query.supplierID == 'all') {
        var query = queryList.getData.replace('***', '');

        var params = [
          req.query.startDate,
          req.query.endDate,
        ];
      } else if (req.query.category != 'all' && req.query.supplier == 'all') {
        var query = queryList.getData.replace('***', `AND PRODUCTS.CATEGORY = '${req.query.categoryID}'`);

        var params = [
          req.query.startDate,
          req.query.endDate,
        ];
      } else if (req.query.category == 'all' && req.query.supplier != 'all') {
        var query = queryList.getData.replace('***', `AND PRODUCTS.SUPPLIER = '${req.query.supplierID}'`);

        var params = [
          req.query.startDate,
          req.query.endDate,
        ];
      } else if (req.query.category != 'all' && req.query.supplier != 'all') {
        var query = queryList.getData.replace('***', `AND PRODUCTS.CATEGORY = '${req.query.categoryID}' AND PRODUCTS.SUPPLIER = '${req.query.supplierID}'`);

        var params = [
          req.query.startDate,
          req.query.endDate,
        ];
      }

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(query, params, (error, result) => {
        if(error) {
          dbConn.end();
          return res.status(401).json({
            flag: false,
            data: error,
          })
        }

        res.status(200).json({
          flag: true,
          data: result,
        });
      });
    });
  },
}

module.exports = productSalesController;
