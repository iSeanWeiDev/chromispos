require('dotenv').config();
var mysql = require('mysql2');
var sqliteService = require('./../../../services/sqlite');
var queryList = require('../../../database/queries/emailer/largeorder');
var subEmailContent = require('../designs/largeorder');

var largeOrder = {
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
          html += `<span>${obj.DATENEW}, ${process.env.SHOP_NAME} order ${obj.ORDERS} total $${obj.TOTAL}</span><br>`
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

module.exports = largeOrder;
