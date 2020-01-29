require('dotenv').config();
var mysql = require('mysql2');
var sqliteService = require('./../../../services/sqlite');
var queryList = require('../../../database/queries/emailer/dailysales');
var subEmailContent = require('../designs/dailysales');

var dailySales = {
  getContent: (callback) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;
      var query = queryList.getData;
      var params = [];

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });
  
      dbConn.query(query, params, (err, result) => {
        if (err) {
          console.log(err);
          
          dbConn.end();

          callback({
            flag: false,
            data: err
          });
        }

        var html = subEmailContent.header.replace('shopName', process.env.SHOP_NAME);
        var date = new Date();
        var sendDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        var subtitle = subEmailContent.subtitle.replace('shopName', process.env.SHOP_NAME).replace('date', sendDate);
        
        for (var obj of result) {
          html += `<tr style="width: 100%; text-align:left">
                    <td scope="row" style="width:25%">
                      ${obj.DATENEW}
                    </td>
                    <td style="width:25%">
                      ${obj.COUNTORDER}
                    </td>
                    <td style="width:25%;text-align:center;">
                      ${obj.LARGESTORDER}
                    </td>
                    <td style="width:25%;text-align:center;">
                      ${obj.TOTALSALES}
                    </td>
                  </tr>`;
        }

        html += subEmailContent.footer;

        callback({
          flag: true,
          data: {
            subtitle: subtitle,
            html: html,
          }
        });
        dbConn.end()
      });
    });
  },
}

module.exports = dailySales;
