var UserModel = require('../models').User;

var authController = {
  login: (req, res) => {
    UserModel.findOne({
      where: {
        email: req.body.email,
      },
    }).then(user => {
      if(!user) {
        res.json({
          flag: false,
          message: 'Authentication failure, User not found'
        });
      } else {
        user.comparePassword(req.body.password, (error, isMatch) => {
          if(isMatch && !error) {
            req.session.user = {
              id: user.get().id,
              userName: user.get().userName,
              email: user.get().email,
              role: user.get().role,
            }

            req.session.authenticated = true;

            res.json({
                flag: true,
                message: `Welcome ${user.get().userName}`
            });
          } else {
            res.json({
                flag: false,
                message: 'Invalid credential.'
            });
          }
        });
      }
    }).catch(error => {
      console.log("error:", error);

      res.json({
        flag: false,
        message: 'Server connection error'
      });
    });
  },
  register: (req, res) => {
    UserModel.count({
      where: {
        email: req.body.email,
      },
    }).then(result => {
      if(result > 0) {
        res.json({
          flag: false,
          message: 'This email already used before.'
        });
      } else {
        var newUser = {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          role: 'user',
        };

        UserModel.create(newUser)
          .then(user => {
            res.json({
              flag: true,
              message: 'Created the account.'
            })
          })
          .catch(error => {
            console.log('error', error)
            res.json({
              flag: false,
              message: 'Server connection error.'
            });
          });
      }
    }).catch(error => {
      console.log('error', error)
      res.json({
        flag: false,
        message: 'Server connection error.'
      });
    });
  },
}

module.exports = authController;
