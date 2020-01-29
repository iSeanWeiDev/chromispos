require('dotenv').config();
var mysql = require('mysql2');
var queryList = require('../../database/queries/reports/warehouseMover');
var sqliteService = require('../../services/sqlite');

var wareHoseMoverController = {
  getData: (req, res) => {
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
          dbConn.end();
          
          return res.status(500).json({
            flag: false, 
            data: getDataErr
          });
        }

        dbConn.query(sellHistoryQuery, sellHistoryParams, (sellHistoryErr, sellHistoryResult) => {
          if (sellHistoryErr) {
            console.log(sellHistoryErr);
            dbConn.end();

            return res.status(500).json({
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
            if(obj.DATA30 > 0 || obj.DATA60 > 0  || obj.DATA90 > 0 ) {
              var unitSales = obj.SALESFLOORUNIT == "##" ? 0 : Math.abs(parseInt(obj.SALESFLOORUNIT));
              var unitWare = obj.WAREHOUSEUNIT == "##" ? 0 : Math.abs(parseInt(obj.WAREHOUSEUNIT));
              var sumUnits = unitSales + unitWare;

              if(sumUnits == 0) {
                obj.ESTIMATION = 0;
              } else {
                if(parseInt(obj.DATA60) > 0) {
                  var rate = obj.DATA60 / 60;
                  var day = sumUnits / rate;
                  obj.ESTIMATION = Math.round(day);
                } else {
                  if(parseInt(obj.DATA90) > 0) {
                      var rate = obj.DATA90 / 90;
                      var day = sumUnits / rate;
                      obj.ESTIMATION = Math.round(day);
                  } else {
                    obj.ESTIMATION = 1000;
                  }
                }
              }
            } else {
              var unitSales = obj.SALESFLOORUNIT == "##" ? 0 : Math.abs(parseInt(obj.SALESFLOORUNIT));
              var unitWare = obj.WAREHOUSEUNIT == "##" ? 0 : Math.abs(parseInt(obj.WAREHOUSEUNIT));
              var sumUnits = unitSales + unitWare;

              if (sumUnits == 0) {
                obj.ESTIMATION = 0;
              } else {
                obj.ESTIMATION = 1000;
              }
            }
          }

          // push the data to new array for setting.
          for (var obj of getDataResult) {
            var unitSales = obj.SALESFLOORUNIT != "##" ? Math.abs(parseFloat(obj.SALESFLOORUNIT)) : 0;
            var unitWare = obj.WAREHOUSEUNIT != "##" ? Math.abs(parseFloat(obj.WAREHOUSEUNIT)) : 0;
            var sumUnits = unitSales + unitWare;

            if (sumUnits > 0) {
              if (obj.DATA30 > 0 || obj.DATA60 > 0  || obj.DATA90 > 0) {
                if (parseInt(obj.ESTIMATION) > 0 && parseInt(obj.ESTIMATION) < 40 && unitSales < unitWare) {
                  historyArrayList.arrNewData.push(obj);
                }
              }
            }
          }

          // Match array
          var arrNewData2 = [];
          for (var i=0; i < historyArrayList.arrNewData.length; i++) {
            if(i < historyArrayList.arrNewData.length-1) {
              if(historyArrayList.arrNewData[i].PRODUCTID == historyArrayList.arrNewData[i+1].PRODUCTID) {
                if(historyArrayList.arrNewData[i].WAREHOUSEUNIT == "##") {
                  arrNewData2.push({
                    PRODUCTID: historyArrayList.arrNewData[i].PRODUCTID,
                    CATEGORYID: historyArrayList.arrNewData[i].CATEGORYID,
                    REFERENCE: historyArrayList.arrNewData[i].REFERENCE,
                    CODE: historyArrayList.arrNewData[i].CODE,
                    PRODUCTNAME: historyArrayList.arrNewData[i].PRODUCTNAME,
                    PRICESELL: historyArrayList.arrNewData[i].PRICESELL,
                    SALESFLOORUNIT:  historyArrayList.arrNewData[i].SALESFLOORUNIT,
                    WAREHOUSEUNIT: historyArrayList.arrNewData[i+1].WAREHOUSEUNIT,
                    DATA30: historyArrayList.arrNewData[i].DATA30,
                    DATA60: historyArrayList.arrNewData[i].DATA60,
                    DATA90: historyArrayList.arrNewData[i].DATA90,
                    ESTIMATION: historyArrayList.arrNewData[i].ESTIMATION
                  })
                  i = i + 1;
                } else {
                  arrNewData2.push({
                    PRODUCTID: historyArrayList.arrNewData[i].PRODUCTID,
                    CATEGORYID: historyArrayList.arrNewData[i].CATEGORYID,
                    REFERENCE: historyArrayList.arrNewData[i].REFERENCE,
                    CODE: historyArrayList.arrNewData[i].CODE,
                    PRODUCTNAME: historyArrayList.arrNewData[i].PRODUCTNAME,
                    PRICESELL: historyArrayList.arrNewData[i].PRICESELL,
                    SALESFLOORUNIT:  historyArrayList.arrNewData[i+1].SALESFLOORUNIT,
                    WAREHOUSEUNIT: historyArrayList.arrNewData[i].WAREHOUSEUNIT,
                    DATA30: historyArrayList.arrNewData[i].DATA30,
                    DATA60: historyArrayList.arrNewData[i].DATA60,
                    DATA90: historyArrayList.arrNewData[i].DATA90,
                    ESTIMATION: historyArrayList.arrNewData[i].ESTIMATION
                  });

                  i = i+1;
                }
              } else {
                arrNewData2.push(historyArrayList.arrNewData[i]);
              }
            } else {
              continue;
            }
          }

          
          
          var sendData = [];
          for(var obj of arrNewData2) {
            var unitSales = obj.SALESFLOORUNIT != "##" ? obj.SALESFLOORUNIT : 0;
            var unitWare = obj.WAREHOUSEUNIT != "##" ? obj.WAREHOUSEUNIT : 0;

            sendData.push({
              PRODUCTID: obj.PRODUCTID,
              CATEGORYID: obj.CATEGORYID,
              CODE: obj.CODE,
              PRODUCTNAME: obj.PRODUCTNAME,
              PRICESELL: obj.PRICESELL,
              SALESFLOORUNIT: unitSales,
              WAREHOUSEUNIT: unitWare,
              DATA30: obj.DATA30,
              DATA60: obj.DATA60,
              DATA90: obj.DATA90,
              ESTIMATION: obj.ESTIMATION 
            });
          }

          res.status(200).json({
            flag: true,
            data: sendData,
          });

          sendData = [];
          arrNewData2 = [];
          historyArrayList = {
            arrDATA30: [],
            arrDATA60: [],
            arrDATA90: [],
            arrNewData: [],
          }

          dbConn.end();
        });
      });
    });
  },
};

module.exports = wareHoseMoverController;
