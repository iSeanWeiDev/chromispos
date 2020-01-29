require('dotenv').config();
var mysql = require('mysql2');
var sqliteService = require('../../services/sqlite');
var queryList = require('../../database/queries/reports/stockDiary');

var stockDiaryController = {
  getData: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;
      var query = queryList.getData;

      var params = [
        process.env.LOCATION_SALES_FLOOR,
        process.env.LOCATION_WARE_HOUSE_IN_BANK
      ];

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(query, params, (error, results) => {
        if (error) {
          dbConn.end();

          return res.status(401).json({
            flag: false,
            data: error,
          });
        }

        var arrNewData = [];

        for(var i=0; i<results.length; i++) {
          if(i < results.length-1) {
            if(results[i].PRODUCTID == results[i+1].PRODUCTID) {
              if(results[i].WAREHOUSEUNIT == "##") {
                arrNewData.push({
                  PRODUCTID: results[i].PRODUCTID,
                  CATEGORYID: results[i].CATEGORYID,
                  REFERENCE: results[i].REFERENCE,
                  CODE: results[i].CODE,
                  PRODUCTNAME: results[i].PRODUCTNAME,
                  PRICESELL: results[i].PRICESELL,
                  SALESFLOORUNIT:  results[i].SALESFLOORUNIT,
                  WAREHOUSEUNIT: results[i+1].WAREHOUSEUNIT
                });

                i = i+1;
              } else {
                arrNewData.push({
                  PRODUCTID: results[i].PRODUCTID,
                  CATEGORYID: results[i].CATEGORYID,
                  REFERENCE: results[i].REFERENCE,
                  CODE: results[i].CODE,
                  PRODUCTNAME: results[i].PRODUCTNAME,
                  PRICESELL: results[i].PRICESELL,
                  SALESFLOORUNIT:  results[i+1].SALESFLOORUNIT,
                  WAREHOUSEUNIT: results[i].WAREHOUSEUNIT
                });

                i = i+1;
              }
            } else {
                arrNewData.push(results[i]);
            }
          } else {
            break;
          }
        }

        res.status(200).json({
          flag: true,
          data: arrNewData,
        });

        arrNewData = [];
        dbConn.end();
      })
    });
  },
  updateData: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;
      var fSale = false;
      var fWare = false;

      var locSalID = process.env.LOCATION_SALES_FLOOR;
      var locWareID = process.env.LOCATION_WARE_HOUSE_IN_BANK;
      var siteGUID = process.env.SITE_GUID;
      var productUpdateQuery = queryList.productUpdate;
      var productUpdateParams = [
        req.body.valRef, 
        req.body.valName,
        req.body.valPrice,
        req.body.productID
      ];

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(productUpdateQuery, productUpdateParams, (productError, productResult) => {
        if (productError) {
          dbConn.end();

          return res.status(401).json({
            flag: false,
            data: productError
          });
        }

        if(req.body.valSale != '') {
          var salesQuery = req.body.wasNullSale == 'false'
            ? queryList.stockCurrentUpdate
            : queryList.stockCurrentInsert;
          var salesParams = req.body.wasNullSale == 'false'
            ? [parseFloat(req.body.valSale), req.body.productID, req.body.categoryID, locSalID]
            : [locSalID, req.body.productID, parseFloat(req.body.valSale), siteGUID, 1];

          dbConn.query(salesQuery, salesParams, (saleError, saleResult) => {
            if (saleError) {
              dbConn.end();

              return res.status(401).json({
                flag: false,
                data: saleError,
              });
            }

            fSale = true;
          });
        } else {
          fSale = true
        }

        if(req.body.valWare != '') {
          var wareQuery = req.body.wasNullWare == 'false'
            ? queryList.stockCurrentUpdate
            : queryList.stockCurrentInsert;
          var wareParams = req.body.wasNullWare == 'false'
            ? [parseFloat(req.body.valWare), req.body.productID, req.body.categoryID, locWareID]
            : [locWareID, req.body.productID, parseFloat(req.body.valWare), siteGUID, 1];

          dbConn.query(wareQuery, wareParams, (wareError, wareResult) => {
            if (wareError) {
              dbConn.end();

              return res.status(401).json({
                flag: false,
                data: wareError,
              });
            }

            fWare = true;
          });
        } else {
          fWare = true
        }
      });

      var productUpdate2Query = queryList.productUpdate2;
      var productUpdate2Params = [req.body.changedCategoryID, req.body.changedSupplierID, req.body.productID];
      dbConn.query(productUpdate2Query, productUpdate2Params, (err, result) => {
        if (err) {
          console.log(err);
        }
      });

      setTimeout(() => {
        if (fSale == true && fWare == true) {
          res.status(200).json({
            flag: true,
            data: ''
          });

          dbConn.end();
        }
      }, 300);
    });
  },
  getCategories: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      var query = queryList.getCategories;
      var params = [];

      dbConn.query(query, params, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            flag: false,
            data: err,
          });
        }

        res.status(201).json({
          flag: true, 
          data: result,
        });
      });

      dbConn.end();
    });
  },
  getSuppliers: (req, res) => {
    sqliteService.getDbInfoByName(process.env.SHOP_NAME, cb => {
      var dbInfo = cb;
      
      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      var query = queryList.getSuppliers;
      var params = [];

      dbConn.query(query, params, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            flag: false,
            data: err,
          })
        }

        res.status(201).json({
          flag: true, 
          data: result,
        });
      });

      dbConn.end();
    });
  }
}

module.exports = stockDiaryController;
