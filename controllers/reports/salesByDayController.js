require('dotenv').config();
var mysql = require('mysql2');
var sqliteService = require('../../services/sqlite');
var queryList = require('../../database/queries/reports/salesByDay');

var salesByDayController = {
  getData: (req, res) => {
    sqliteService.getDbInfoByName(req.query.hostName, cb => {
      var dbInfo = cb;

      if(req.query.categoryID == 'all') {
        var query = queryList.getData.replace('***', '');
        var params = [
          req.query.startDate,
          req.query.endDate
        ];
      } else {
        var query = queryList.getData.replace('***', `AND CATEGORIES.id = '${req.query.categoryID}'`);
        var params = [
          req.query.startDate,
          req.query.endDate
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
        if (error) {
          dbConn.end();
          return res.status(401).json({
            flag: false,
            data: error,
          });
        }

        res.status(200).json({
          flag: true,
          data: result,
        });
        dbConn.end()
      })
    })
  },
}

module.exports = salesByDayController;
