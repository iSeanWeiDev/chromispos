var ReportModel = require('../../models').Report;

var reportsController = {
  saveReport: (req, res) => {
    var newReport = {
      name: req.body.name,
      detail: req.body.detail,
      isAdmin: true,
      isUser: true,
    }

    ReportModel.create(newReport)
      .then(result => {
        res.status(200).json({
          flag: true,
          data: result.get(),
        });
      })
      .catch(error => {
        console.log(error);
        res.status(401).json({
          flag: false,
          data: error,
        });
      });
  },
  deleteReport: (req, res) => {

  },
  updateReport: (req, res) => {

  }
}

module.exports = reportsController;
