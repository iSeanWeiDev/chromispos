require('dotenv').config();
var mysql = require('mysql2');
var sqliteService = require('./../../../services/sqlite');
var queryList = require('./../../../database/queries/emailer/warehousemover');
var subEmailContent = require('./../designs/warehousemover');

var warehouseMover = {};
warehouseMover.getContent = getContent;

function getContent(callback) {
  sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
    var dbInfo = cb;
    var getDataQuery = queryList.getData;
    var sellHistoryQuery = queryList.sellHistory;
    var getDataParams = [
      process.env.LOCATION_SALES_FLOOR,
      process.env.LOCATION_WARE_HOUSE_IN_BANK
    ];
    var sellHistoryParams = [];
    
    var dbConn = mysql.createConnection({
      host: dbInfo.host,
      user: dbInfo.userName,
      password: dbInfo.password,
      database: dbInfo.dbName,
      port: dbInfo.port,
    });

    dbConn.query(getDataQuery, getDataParams, (getDataErr, getDataResult) => {
      if (getDataErr) {
        console.log(getDataErr);
        callback({
          flag: false, 
          data: getDataErr
        });
      }

      dbConn.query(sellHistoryQuery, sellHistoryParams, (sellHistoryErr, sellHistoryResult) => {
        if (sellHistoryErr) {
          console.log(sellHistoryErr);
          callback({
            flag: false,
            data: sellHistoryErr
          });
        }

        var historyArrayList = {
          arrData30: [],
          arrData60: [],
          arrData90: [],
          arrNewData: [],
        }

        for (var obj of sellHistoryResult) {
          if (obj.TYPE == 'DATA30') {
            historyArrayList.arrData30.push(obj);
          }

          if (obj.TYPE == 'DATA60') {
            historyArrayList.arrData60.push(obj);
          }

          if (obj.TYPE == 'DATA90') {
            historyArrayList.arrData90.push(obj);
          }
        }

        // Set sell history to stock array.
        for (var stockObject of getDataResult) {
          stockObject.DATA30 = 0;
          stockObject.DATA60 = 0;
          stockObject.DATA90 = 0;

          for (var sellObject of historyArrayList.arrData30) {
            if (stockObject.PRODUCTID == sellObject.PRODUCT) {
              stockObject.DATA30 = sellObject.UNITS;
            }
          }

          for (var sellObject of historyArrayList.arrData60) {
            if (stockObject.PRODUCTID == sellObject.PRODUCT) {
              stockObject.DATA60 = sellObject.UNITS;
            }
          }

          for (var sellObject of historyArrayList.arrData90) {
            if (stockObject.PRODUCTID == sellObject.PRODUCT) {
              stockObject.DATA90 = sellObject.UNITS;
            }
          }
        }

        // Set estimation time.
        for (var obj of getDataResult) {
          if(obj.DATA30 > 0 || obj.DATA60 > 0  || obj.DATA90 > 0) {
            var unitSales = obj.SALESFLOORUNIT == "##" ? 0 : Math.abs(parseInt(obj.SALESFLOORUNIT));
            var unitWare = obj.WAREHOUSEUNIT == "##" ? 0 : Math.abs(parseInt(obj.WAREHOUSEUNIT));
            var sumUnits = unitSales + unitWare;

            if (sumUnits > 0) {
              if (obj.DATA60 > 0) {
                var rate = obj.DATA60 / 60;
                var day = sumUnits / rate;
                obj.ESTIMATION = Math.round(day);
              } else {
                if(obj.DATA90 > 0) {
                  var rate = obj.DATA90 / 90;
                  var day = sumUnits / rate;
                  obj.ESTIMATION = Math.round(day);
                } else {
                  obj.ESTIMATION = '1000';
                }
              }
            } else {
              obj.ESTIMATION = '0';
            }
          } else {
            obj.ESTIMATION = '1000';
          }
        }

        // push the data to new array for setting.
        for (var obj of getDataResult) {
          var unitSales = obj.SALESFLOORUNIT == "##" ? 0 : Math.abs(parseInt(obj.SALESFLOORUNIT));
          var unitWare = obj.WAREHOUSEUNIT == "##" ? 0 : Math.abs(parseInt(obj.WAREHOUSEUNIT));
          var sumUnits = unitSales + unitWare;

          if (sumUnits > 0) {
            if (obj.DATA30 > 0 || obj.DATA60 > 0  || obj.DATA90 > 0) {
              if (parseInt(obj.ESTIMATION) > 0 && parseInt(obj.ESTIMATION) < 40 && unitSales < unitWare) {
                historyArrayList.arrNewData.push(obj);
              }
            }
          }
        }
        
        var sendData = [];
        for(var obj of historyArrayList.arrNewData) {
          var saleUnit = obj.SALESFLOORUNIT != "##" ? obj.SALESFLOORUNIT : 0;
          var wareUnit = obj.WAREHOUSEUNIT != "##" ? obj.WAREHOUSEUNIT : 0;

          sendData.push({
            PRODUCTID: obj.PRODUCTID,
            CATEGORYID: obj.CATEGORYID,
            CODE: obj.CODE,
            PRODUCTNAME: obj.PRODUCTNAME,
            PRICESELL: obj.PRICESELL,
            SALESFLOORUNIT:  saleUnit,
            WAREHOUSEUNIT: wareUnit,
            DATA30: obj.DATA30,
            DATA60: obj.DATA60,
            DATA90: obj.DATA90,
            ESTIMATION: obj.ESTIMATION 
          });
        }

        var date = new Date();
        var sendDate = ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
        var subtitle = subEmailContent.subtitle.replace('shopName', process.env.SHOP_NAME).replace('date', sendDate);

        var html = subEmailContent.header.replace('shopName', process.env.SHOP_NAME);

        for (var obj of sendData) {
          html += ` <tr style="width: 100%; text-align:left">
                      <td scope="row" style="width:10%">
                        ${obj.CODE}
                      </td>
                      <td style="width:40%">
                        ${obj.PRODUCTNAME}
                      </td>
                      <td style="width:8%;text-align:center;">
                        $${obj.PRICESELL.toFixed(2)}
                      </td>
                      <td style="width:8%;text-align:center;">
                        ${parseInt(obj.SALESFLOORUNIT)}
                      </td>
                      <td style="width:8%;text-align:center;">
                        ${parseInt(obj.WAREHOUSEUNIT)}
                      </td>
                      <td style="width:6.5%;text-align:center;">
                        ${obj.DATA30}
                      </td>
                      <td style="width:6.5%;text-align:center;">
                        ${obj.DATA60}
                      </td>
                      <td style="width:6.5%;text-align:center;">
                        ${obj.DATA90}
                      </td>
                      <td style="width:6.5%;text-align:center;">
                        ${obj.ESTIMATION}
                      </td>
                    </tr>`
        }
        html += subEmailContent.footer;

        callback({
          flag: true,
          data: {
            subtitle: subtitle,
            html: html
          }
        });

        sendData = [];
        historyArrayList = {
          arrDATA15: [],
          arrDATA30: [],
          arrDATA60: [],
          arrDATA90: [],
          arrDATA120: [],
          arrDATA180: [],
          arrDATA365: [],
          arrNewDATA: [],
        }

        dbConn.end();
      });
    });
  });
}

module.exports = warehouseMover;
