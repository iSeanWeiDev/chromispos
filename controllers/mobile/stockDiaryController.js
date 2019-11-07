require('dotenv').config();
var mysql = require('mysql2');
var queryList = require('../../database/queries/mobile/stockDiary');
var sqliteService = require('../../services/sqlite');

var stockDiaryController = {
  getData: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;
      var query = queryList.getData;
      var params = [
        process.env.LOCATION_SALES_FLOOR,
        process.env.LOCATION_WARE_HOUSE_IN_BANK,
        `%${req.query.reference}%`,
      ];

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(query, params, (error, result) => {
        if (error) {
          dbConn.end();

          return res.status(401).json({
            flag: false, 
            data: error,
          })
        }

        res.status(200).json({
          flag: true,
          data: result
        });
        dbConn.end();
      });
    });
  },
  updateData: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;

      if (req.body.isUpdatedSale == true && req.body.qtySale != '') {
        var querySale = queryList.update;
      } 
      if (req.body.isUpdatedSale == true && req.body.qtySale == '') {

      }

      if (req.body.isUpdatedSale != true && req.body.qtySale != '') {

      }

      if (req.body.isUpdatedSale != true && req.body.qtySale == '') {

      }

      var locSalID = process.env.LOCATION_SALES_FLOOR;
      var locWareID = process.env.LOCATION_WARE_HOUSE_IN_BANK;
      var siteGUID = process.env.SITE_GUID;
      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });
    });
  },
};

module.exports = stockDiaryController;
