require('dotenv').config();
var mysql = require('mysql2');
var queryList = require('../../database/queries/reports/inventory');
var sqliteService = require('../../services/sqlite');

var inventoryController = {
  getData: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;
      var sellHistoryQuery = queryList.sellHistory;
      
      if (req.query.category == 'all' && req.query.supplier == 'all') {
        var stockCurrentQuery = queryList.stockCurrent.replace('***', '');

        var stockCurrentParmas = [
          process.env.LOCATION_SALES_FLOOR,
          process.env.LOCATION_WARE_HOUSE_IN_BANK
        ];
      } else if (req.query.category != 'all' && req.query.supplier == 'all') {
        var stockCurrentQuery = queryList.stockCurrent.replace('***', `AND CATEGORIES.ID = '${req.query.category}'`);

        var stockCurrentParmas = [
          process.env.LOCATION_SALES_FLOOR,
          process.env.LOCATION_WARE_HOUSE_IN_BANK,
        ];
      } else if (req.query.category == 'all' && req.query.supplier != 'all') {
        if (req.query.supplier == "none") {
          var stockCurrentQuery = queryList.stockCurrent.replace('***', `AND PRODUCTS.SUPPLIER IS NULL`);

        } else {
          var stockCurrentQuery = queryList.stockCurrent.replace('***', `AND PRODUCTS.SUPPLIER = '${req.query.supplier}'`);
        }

        var stockCurrentParmas = [
          process.env.LOCATION_SALES_FLOOR,
          process.env.LOCATION_WARE_HOUSE_IN_BANK,
        ];
      } else if (req.query.category != 'all' && req.query.supplier != 'all') {
        if (req.query.supplier == "none") {
          var stockCurrentQuery = queryList.stockCurrent.replace('***', `AND CATEGORIES.ID = '${req.query.category}' AND PRODUCTS.SUPPLIER IS NULL`);
        } else {
          var stockCurrentQuery = queryList.stockCurrent.replace('***', `AND CATEGORIES.ID = '${req.query.category}' AND PRODUCTS.SUPPLIER = '${req.query.supplier}'`);
        }

        var stockCurrentParmas = [
          process.env.LOCATION_SALES_FLOOR,
          process.env.LOCATION_WARE_HOUSE_IN_BANK,
        ];
      }

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(stockCurrentQuery, stockCurrentParmas, (stockCurrentError, stockCurrentResult) => {
        if (stockCurrentError) {
          dbConn.end();

          return res.status(401).json({
            flag: false,
            data: stockCurrentError
          });
        }
        
        dbConn.query(sellHistoryQuery, [], (sellHistoryError, sellHistoryResult) => {
          if (sellHistoryError) {
            dbConn.end();

            return res.status(401).json({
              flag: false,
              data: sellHistoryError
            });
  
          }

          var historyArrayList = {
            arrDATA15: [],
            arrDATA30: [],
            arrDATA60: [],
            arrDATA90: [],
            arrDATA120: [],
            arrDATA180: [],
            arrDATA365: [],
            arrNewDATA: [],
          }

          for (var obj of sellHistoryResult) {
            if (obj.TYPE == 'DATA15') {
              historyArrayList.arrDATA15.push(obj);
            }

            if (obj.TYPE == 'DATA30') {
              historyArrayList.arrDATA30.push(obj);
            }

            if (obj.TYPE == 'DATA60') {
              historyArrayList.arrDATA60.push(obj);
            }

            if (obj.TYPE == 'DATA90') {
              historyArrayList.arrDATA90.push(obj);
            }

            if (obj.TYPE == 'DATA120') {
              historyArrayList.arrDATA120.push(obj);
            }

            if (obj.TYPE == 'DATA180') {
              historyArrayList.arrDATA180.push(obj);
            }

            if (obj.TYPE == 'DATA365') {
              historyArrayList.arrDATA365.push(obj);
            }
          }

          // Set sell history to stock array
          for (var stockObject of stockCurrentResult) {
            stockObject.DATA15 = 0;
            stockObject.DATA30 = 0;
            stockObject.DATA60 = 0;
            stockObject.DATA90 = 0;
            stockObject.DATA120 = 0;
            stockObject.DATA180 = 0;
            stockObject.DATA365 = 0;

            for (var sellObject of historyArrayList.arrDATA15) {
              if (stockObject.PRODUCTID == sellObject.PRODUCT) {
                stockObject.DATA15 = sellObject.UNITS;
              }
            }

            for (var sellObject of historyArrayList.arrDATA30) {
              if (stockObject.PRODUCTID == sellObject.PRODUCT) {
                stockObject.DATA30 = sellObject.UNITS;
              }
            }

            for (var sellObject of historyArrayList.arrDATA60) {
              if (stockObject.PRODUCTID == sellObject.PRODUCT) {
                stockObject.DATA60 = sellObject.UNITS;
              }
            }

            for (var sellObject of historyArrayList.arrDATA90) {
              if (stockObject.PRODUCTID == sellObject.PRODUCT) {
                stockObject.DATA90 = sellObject.UNITS;
              }
            }

            for (var sellObject of historyArrayList.arrDATA120) {
              if (stockObject.PRODUCTID == sellObject.PRODUCT) {
                stockObject.DATA120 = sellObject.UNITS;
              }
            }

            for (var sellObject of historyArrayList.arrDATA180) {
              if (stockObject.PRODUCTID == sellObject.PRODUCT) {
                stockObject.DATA180 = sellObject.UNITS;
              }
            }

            for (var sellObject of historyArrayList.arrDATA365) {
              if (stockObject.PRODUCTID == sellObject.PRODUCT) {
                stockObject.DATA365 = sellObject.UNITS;
              }
            }
          }

          // Set the estimation.
          for (var obj of stockCurrentResult) {
            if(obj.DATA15 > 0 || obj.DATA30 > 0 || obj.DATA60 > 0  || obj.DATA90 > 0 ) {
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
          
          // Push the data to new array for setting.
          for(var obj of stockCurrentResult) {
            if(obj.DATA15 > 0 || obj.DATA30 > 0 || obj.DATA60 > 0  || obj.DATA90 > 0 ||  obj.DATA120 > 0 ||  obj.DATA180 > 0 ||  obj.DATA365 > 0 ) {
              historyArrayList.arrNewDATA.push(obj);
            }
          }

          // Match array
          var arrNewData2 = [];
          var arrNewData3 = [];

          for (var i=0; i < historyArrayList.arrNewDATA.length; i++) {
            if(i < historyArrayList.arrNewDATA.length-1) {
              if(historyArrayList.arrNewDATA[i].PRODUCTID == historyArrayList.arrNewDATA[i+1].PRODUCTID) {
                if(historyArrayList.arrNewDATA[i].WAREHOUSEUNIT == "##") {
                  arrNewData2.push({
                    PRODUCTID: historyArrayList.arrNewDATA[i].PRODUCTID,
                    CATEGORYID: historyArrayList.arrNewDATA[i].CATEGORYID,
                    REFERENCE: historyArrayList.arrNewDATA[i].REFERENCE,
                    CODE: historyArrayList.arrNewDATA[i].CODE,
                    PRODUCTNAME: historyArrayList.arrNewDATA[i].PRODUCTNAME,
                    PRICESELL: historyArrayList.arrNewDATA[i].PRICESELL,
                    SALESFLOORUNIT:  historyArrayList.arrNewDATA[i].SALESFLOORUNIT,
                    WAREHOUSEUNIT: historyArrayList.arrNewDATA[i+1].WAREHOUSEUNIT,
                    CATEGORYNAME: historyArrayList.arrNewDATA[i].CATEGORYNAME,
                    SUPPLIERID: historyArrayList.arrNewDATA[i].SUPPLIERID,
                    DATA15: historyArrayList.arrNewDATA[i].DATA15,
                    DATA30: historyArrayList.arrNewDATA[i].DATA30,
                    DATA60: historyArrayList.arrNewDATA[i].DATA60,
                    DATA90: historyArrayList.arrNewDATA[i].DATA90,
                    DATA120: historyArrayList.arrNewDATA[i].DATA120,
                    DATA180: historyArrayList.arrNewDATA[i].DATA180,
                    DATA365: historyArrayList.arrNewDATA[i].DATA365,
                    ESTIMATION: historyArrayList.arrNewDATA[i].ESTIMATION
                  })
                  i = i + 1;
                } else {
                  arrNewData2.push({
                    PRODUCTID: historyArrayList.arrNewDATA[i].PRODUCTID,
                    CATEGORYID: historyArrayList.arrNewDATA[i].CATEGORYID,
                    REFERENCE: historyArrayList.arrNewDATA[i].REFERENCE,
                    CODE: historyArrayList.arrNewDATA[i].CODE,
                    PRODUCTNAME: historyArrayList.arrNewDATA[i].PRODUCTNAME,
                    PRICESELL: historyArrayList.arrNewDATA[i].PRICESELL,
                    SALESFLOORUNIT:  historyArrayList.arrNewDATA[i+1].SALESFLOORUNIT,
                    WAREHOUSEUNIT: historyArrayList.arrNewDATA[i].WAREHOUSEUNIT,
                    CATEGORYNAME: historyArrayList.arrNewDATA[i].CATEGORYNAME,
                    SUPPLIERID: historyArrayList.arrNewDATA[i].SUPPLIERID,
                    DATA15: historyArrayList.arrNewDATA[i].DATA15,
                    DATA30: historyArrayList.arrNewDATA[i].DATA30,
                    DATA60: historyArrayList.arrNewDATA[i].DATA60,
                    DATA90: historyArrayList.arrNewDATA[i].DATA90,
                    DATA120: historyArrayList.arrNewDATA[i].DATA120,
                    DATA180: historyArrayList.arrNewDATA[i].DATA180,
                    DATA365: historyArrayList.arrNewDATA[i].DATA365,
                    ESTIMATION: historyArrayList.arrNewDATA[i].ESTIMATION
                  });

                  i = i+1;
                }
              } else {
                arrNewData2.push(historyArrayList.arrNewDATA[i]);
              }
            } else {
              continue;
            }
          }
        
          for(var obj of arrNewData2) {
            var saleUnit = obj.SALESFLOORUNIT != "##" ? obj.SALESFLOORUNIT : 0;
            var wareUnit = obj.WAREHOUSEUNIT != "##" ? obj.WAREHOUSEUNIT : 0;

            arrNewData3.push({
              PRODUCTID: obj.PRODUCTID,
              CATEGORYID: obj.CATEGORYID,
              REFERENCE: obj.REFERENCE,
              CODE: obj.CODE,
              PRODUCTNAME: obj.PRODUCTNAME,
              PRICESELL: obj.PRICESELL,
              SALESFLOORUNIT:  saleUnit,
              WAREHOUSEUNIT: wareUnit,
              CATEGORYNAME: obj.CATEGORYNAME,
              SUPPLIERID: obj.SUPPLIERID,
              DATA15: obj.DATA15,
              DATA30: obj.DATA30,
              DATA60: obj.DATA60,
              DATA90: obj.DATA90,
              DATA120: obj.DATA120,
              DATA180: obj.DATA180,
              DATA365: obj.DATA365,
              ESTIMATION: obj.ESTIMATION 
            });
          }

          res.status(200).json({
            flag: true,
            data: arrNewData3,
          });

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
          
          arrNewData2 = [];
          arrNewData3 = [];
          dbConn.end();
        });
      });
    });
  },
  getItemSoldHistory: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;
      var query = queryList.itemSoldHistory;
      var params = [req.query.productID];

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
                  });
        }

        res.status(200).json({
          flag: true,
          data: result,
        });

        dbConn.end();
      });
    });
  }
}

module.exports = inventoryController;
