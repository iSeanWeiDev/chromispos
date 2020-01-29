require('dotenv').config();
var mysql = require('mysql2');
var queryList = require('../../database/queries/reports/inventoryTransfer');

var inventoryTransfer = {
  getData: (req, res) => {
    var dbConn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    dbConn.query(queryList.getCathedral, (cathedralErr, cathedralResult) => {
      if (cathedralErr) {
        console.log(cathedralErr);
        dbConn.end()

        return res.status(500).json({
          flag: false,
          data: cathedralErr
        });
      }

      dbConn.query(queryList.getFV, (fvErr, fvResult) => {
        if (fvErr) {
          console.log(fvErr);
          dbConn.end()
  
          return res.status(500).json({
            flag: false,
            data: fvErr
          });
        }
        
        var sendData = [];
        for (var obj of cathedralResult) {
          sendData.push({
            barcode: obj.barcode,
            name: obj.name,
            price: obj.price,
            qtyC: obj.total_qty,
            qtyF: null,
            c30d: obj.day30,
            c60d: obj.day60,
            c90d: obj.day90,
            f30d: null,
            f60d: null,
            f90d: null,
          });
        }

        for (var objFV of fvResult) {
          var isDuplicated = false;
          for (var obj of sendData) {
            if (objFV.barcode == obj.barcode) {
              obj.qtyF = objFV.total_qty;
              obj.f30d = objFV.day30;
              obj.f60d = objFV.day60;
              obj.f90d = objFV.day90;
              isDuplicated = true;
              break;
            }
          }

          if (!isDuplicated) {
            sendData.push({
              barcode: objFV.barcode,
              name: objFV.name,
              price: objFV.price,
              qtyC: null,
              qtyF: objFV.total_qty,
              c30d: null,
              c60d: null,
              c90d: null,
              f30d: objFV.day30,
              f60d: objFV.day60,
              f90d: objFV.day90,
            });
          } 
        }

        res.status(200).send({
          flag: true,
          data: sendData,
        });

        dbConn.end();
      });
    });
  }
}

module.exports = inventoryTransfer;
