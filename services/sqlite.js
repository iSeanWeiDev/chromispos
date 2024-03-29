var DbModel = require('../models').db;
var ReportModel = require('../models').Report;
var UserModel = require('../models').User;

var sqliteService = {};
sqliteService.getDbInfoByName = getDbInfoByName;
sqliteService.getReportList = getReportList;
sqliteService.getUserList = getUserList;

function getDbInfoByName(name, cb) {
  DbModel.findOne({
    where: {
      hostName: name,
    },
  }).then(result => {
    cb(result.get());
  });
}


function getReportList(status, cb) {
  if(status == "admin") {
    ReportModel.findAll({
      where: {
        isAdmin: true,
      },
    }).then((result) => {
      var arrReportList = [];

      result.forEach(item => {
        arrReportList.push(item.get());
      });

      cb(arrReportList);
    }).catch((err) => {
      console.log(error);
    });
  }

  if(status == "user") {
    ReportModel.findAll({
      where: {
        isUser: true,
      },
    }).then((result) => {
      var arrReportList = [];

      result.forEach(item => {
        arrReportList.push(item.get());
      });

      cb(arrReportList);
    }).catch((err) => {
      console.log(error);
    });
  }

  if(status == "initial") {
    ReportModel.findAll()
      .then((result) => {
        var arrReportList = [];

        result.forEach(item => {
          arrReportList.push(item.get());
        });

        cb(arrReportList);
      }).catch((err) => {
        console.log(err);
      });
  }
}

function getUserList(cb) {
  UserModel.findAll()
    .then(result => {
      var arrUser = [];
      result.forEach(item => {
        arrUser.push(item.get());
      });

      cb(arrUser);
    })
    .catch(error => {
      console.log(error);
    });
}

module.exports = sqliteService;
