var ReportModel = require('../models').Report;
var reportService = {};

reportService.getReportList = getReportList;

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

module.exports = reportService;