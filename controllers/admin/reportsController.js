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
    ReportModel.destroy({
      where: {
        id: req.body.id
      }
    }).then(result => {
      if (result == 1) {
        res.status(200).json({ 
          flag: true,
          data: ""
        })
      }
    }).catch(error => {
      console.log(error);
      req.status(401).json({
        flag: false,
        data: error
      })
    });
  },
  updateReport: (req, res) => {
    ReportModel.findOne({
      where: {
        id: req.body.id
      }
    }).then(result => {
      if (result.get().isUser == true) {
        var updateData = {
          isUser: false,
        }
      } else {
        var updateData = {
          isUser: true,
        }
      }

      ReportModel.update(updateData, {
        where: {
          id: req.body.id
        }
      }).then(() => {
        res.status(200).json({
          flag: true,
          data: ""
        });
      })
    }).catch(error => {
      console.log(error);
      res.status(401).json({
        flag: false,
        data: error
      })
    });
  }
}

module.exports = reportsController;
