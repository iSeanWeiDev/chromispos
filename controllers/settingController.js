var DbModel = require('../models').db;
var settingService = require('../services/setting');

var settingController = {
  saveConnection: (req, res) => {
    var data = {
      host: req.body.host,
      user: req.body.userName,
      password: req.body.password,
      database: req.body.dbName,
      connectionLimit: 10,
    }
    settingService.validateConn(data, cb => {
      if (cb == true) {
        DbModel.create(req.body)
          .then(result => {
            res.send({
              flag:true,
              message: 'Created the connection'
            });
          })
          .catch(error => {
            console.log(error);
            res.send({
              flag: false,
              message: 'Connection error',
            });
          });
      } else {
        res.send({
          flag: false,
          message: 'Connection error',
        });
      }
    });
  },
}

module.exports = settingController;
