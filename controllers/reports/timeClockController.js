var mysql = require('mysql2');
var queryList = require('../../database/queries/reports/timeClock');
var sqliteService = require('../../services/sqlite');

var timeClockController = {
  getData: (req, res) => {
    sqliteService.getDbInfoByName(req.query.hostName, cb => {
      var dbInfo = cb;
      
      if (req.query.peopleID == "all") {
        var query = queryList.getData.replace('***', '');
        var params = [
          req.query.startDate,
          req.query.endDate,
        ];
      } else {
        var query = queryList.getData.replace('***', `AND PEOPLE.id = '${req.query.peopleID}'`);
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
        if (error) {
          dbConn.end();

          return res.status(401).json({
            flag: false,
            data: error,
          });
        }

        var arrNewData = [];
        var nonUsefulUsers = ["Employee", "Administrator", "Manager"];

        for(var obj of result) {
          if(nonUsefulUsers.indexOf(obj.NAME) < 0 && obj.STARTSHIFT != null && obj.ENDSHIFT != null) {
              var totalHours = calcBetweenDates(obj.ENDSHIFT, obj.STARTSHIFT);
              obj.TOTALHOURS = calcBetweenDates(obj.ENDSHIFT, obj.STARTSHIFT) > 8 ? 8 : calcBetweenDates(obj.ENDSHIFT, obj.STARTSHIFT);
              obj.OVERTIME =totalHours > 8 ?  parseFloat(totalHours) - 8 : 0;
              arrNewData.push(obj);
          }
        }

        res.status(200).json({
          flag: true,
          data: arrNewData,
        });

        dbConn.end();
      })
    })
  },
}

function calcBetweenDates(isoDate1, isoDate2) {
  if (isoDate1 != null && isoDate2 != null) {
      var date1 = new Date(isoDate1);
      var date2 = new Date(isoDate2);
  
      return Math.abs(date1 - date2) / 36e5;
  }
  return null;
}

module.exports = timeClockController;
