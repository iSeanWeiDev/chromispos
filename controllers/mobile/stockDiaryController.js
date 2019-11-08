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
      var locSalID = process.env.LOCATION_SALES_FLOOR;
      var locWareID = process.env.LOCATION_WARE_HOUSE_IN_BANK;
      var siteGUID = process.env.SITE_GUID;
      var fSale = false;
      var fWare = false;
      var queryUpdateProduct = queryList.productUpdate;
      var paramsUpdateProduct = [
        req.body.productName,
        req.body.price.split('$')[1],
        req.body.productID
      ];

      var dbConn = mysql.createConnection({
        host: dbInfo.host,
        user: dbInfo.userName,
        password: dbInfo.password,
        database: dbInfo.dbName,
        port: dbInfo.port,
      });

      dbConn.query(queryUpdateProduct, paramsUpdateProduct, (errorProduct, resultProdut) => {
        if(errorProduct) {
          dbConn.end();

          return res.status(401).json({
            flag: false,
            data: errorProduct,
          });
        }

        if (req.body.qtySale != "") {
          var querySale = req.body.wasNullSale == "false"
            ? queryList.stockCurrentUpdate
            : queryList.stockCurrentInsert;
          var paramsSale = req.body.wasNullSale == "false"
            ? [parseFloat(req.body.qtySale), req.body.productID, req.body.categoryID, locSalID]
            : [locSalID, req.body.productID, parseFloat(req.body.qtySale), siteGUID, 1];

          dbConn.query(querySale, paramsSale, (errorSale, resultSale) => {
            if (errorSale) {
              dbConn.end();
              fSale = false;

              return res.status(401).json({
                flag: false,
                data: errorSale,
              });
            }
  
            fSale = true
          });
        } else {
          fSale = true;
        }

        if (req.body.qtyWare != "") {
          var queryWare = req.body.wasNullWare == "false"
            ? queryList.stockCurrentUpdate
            : queryList.stockCurrentInsert;
          var paramsWare = req.body.wasNullWare == "false"
            ? [parseFloat(req.body.qtyWare), req.body.productID, req.body.categoryID, locWareID]
            : [locWareID, req.body.productID, parseFloat(req.body.qtyWare), siteGUID.toString(), 1];
          
          dbConn.query(queryWare, paramsWare, (errorWare, resultWare) => {
            if (errorWare) {
              dbConn.end();
              fWare = false;

              return res.status(401).json({
                flag: false,
                data: errorWare,
              });
            }

            fWare = true;
          });
        } else {
          fWare = true;
        }

        setTimeout(() => {
          if (fSale == true && fWare == true) {
            dbConn.end();
            res.status(200).json({
              flag: true,
              data: resultProdut
            });
          } else {
            dbConn.end();

            res.status(401).json({
              flag: false,
              data: resultProdut
            })
          }
        }, 300);
      });
    });
  },
};

module.exports = stockDiaryController;
