var bcrypt = require('bcrypt-nodejs');
var UserModel = require('../../models').User;

var usersController = {
  createAccount: (req, res) => {
    var newAccount = {
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      role: 'user',
    };

    UserModel.create(newAccount)
      .then(result => {
        res.status(200),json({
          flag: true,
          data: result.get()
        });
      })
      .catch(error => {
        console.log(error)
        res.status(401).json({
          flag: false,
          data: error,
        })
      });
  },
  changePassword: (req, res) => {
    var updateData = {
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
    }
    UserModel.update(updateData, {
      where: {
        id: req.body.id,
      }
    }).then(result => {
      res.status(200).json({
        flag: true,
        data: result
      })
    }).catch(error => {
      console.log(error);
      res.status(401).json({
        flag: false,
        data: error,
      })
    });
  },
  deleteAccount: (req, res) => {
    UserModel.destroy({
      where: {
        id: req.body.id
      }
    }).then(() => {
      res.status(200).json({
        flag: true,
        data: 'Deleted',
      })
    }).catch(error => {
      console.log(error);
      res.status(401).json({
        flag: false,
        data: error,
      })
    });
  }
}

module.exports = usersController;
