require('dotenv').config();
var mysql = require('mysql2');
var sqliteService = require('../../services/sqlite');
var queryList = require('../../database/queries/reports/salesByYear');

var salesByYearController = {
  getData: (req, res) => {
    sqliteService.getDbInfoByName(req.query.hostName, cb => {
      var dbInfo = cb;
      if(req.query.categoryID == 'all') {
        var query = queryList.getData.replace('***', '');
        var params = [];
      } else {
        var query = queryList.getData.replace('***', `AND CATEGORIES.id = '${req.query.categoryID}'`);
        var params = [];
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

module.exports = salesByYearController;
