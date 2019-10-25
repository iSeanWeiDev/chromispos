require('dotenv').config();
var mysql = require('mysql2');
var sqliteService = require('../../services/sqlite');
var queryList = require('../../database/queries/getList');

var getListContorller = {
  getCategoryList: (req, res) => {
    if (req.query.report == "inventory") {
      var dbName = process.env.SHOP_NAME;
    } else {
      var dbName = req.query.hostName;
    }

    sqliteService.getDbInfoByName(dbName, cb => {
      var dbInfo = cb;
      var query = queryList.categories;
      var params = [];

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(query, params, (error, result) => {
        if(error) {
          res.json({
            cb: false,
            data: error,
          });

          dbConn.end();
        }

        var arrSendData = [];
        for(var obj of result) {
          arrSendData.push(obj);
        }

        res.json({
          flag: true,
          data: arrSendData,
        });
        arrSendData = [];
      });
    });
  },
  getSupplierList: (req, res) => {
    if (req.query.report == "inventory") {
      var dbName = process.env.SHOP_NAME;
    } else {
      var dbName = req.query.hostName;
    }

    sqliteService.getDbInfoByName(dbName, cb => {
      var dbInfo = cb;
      var query = queryList.suppliers;
      var params = [];

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(query, params, (error, result) => {
        if(error) {
          res.json({
            cb: false,
            data: error,
          });
          
          dbConn.end();
        }

        var arrSendData = [];
        for(var obj of result) {
          arrSendData.push(obj);
        }

        res.json({
          flag: true,
          data: arrSendData,
        });
        arrSendData = [];
      });
    });
  }
}

module.exports = getListContorller;
