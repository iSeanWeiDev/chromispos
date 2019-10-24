var mysql = require('mysql2');
var DBModel = require('../models').db;

var settingService = {};
settingService.validateConn = validateConn;
settingService.getDBConnList = getDBConnList;

function validateConn(data, cb) {
console.log('data :', data);
  const pool = mysql.createPool(data);

  pool.getConnection((err, conn) => {
    if (conn && !err) {
      cb(true);
    } else {
      cb(false);
    }
  });
}

function getDBConnList(cb) {
  DBModel.findAll()
    .then(result => {
      var arrDbConnList = [];
      if(result.length > 0) {
        for(var obj of result) {
          arrDbConnList.push(obj.get());
        }

        cb(arrDbConnList);
      } else {
        cb(arrDbConnList);
      }
      
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = settingService;
