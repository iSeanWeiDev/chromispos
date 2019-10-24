var DbModel = require('../models').db;
var settingService = require('../services/setting');

var settingController = {
  saveConnection: (req, res) => {
    var data = {
      host: req.body.host,
      user: req.body.userName,
      database: req.body.dbName,
      waitForConnections: true,
      connectionLimit: 100,
      queueLimit: 0
    }
    settingService.validateConn(data, cb => {
      if (cb == true) {
        DbModel.create(req.body)
          .then(result => {
            console.log(result.get());
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
