var express = require('express');
var router = express.Router();
var sqliteService = require('../services/sqlite');
var settingService = require('../services/setting');

/* GET home page. */
router.get('/', function(req, res) {
  sqliteService.getReportList('initial', cb => {
    if(req.session.authenticated) {
      return res.redirect('/home');
    } 

    res.render('pages/home', {
      data: cb,
      isAuthenticated: false,
    });
  });
});

router.get('/login', function(req, res) {
  if(req.session.authenticated) {
    return res.redirect('/home');
  } 

  res.render('pages/auth/login', {
    isAuthenticated: false
  });
});

router.get('/logout',(req, res) => {
  req.session.destroy();
   res.redirect('/');
});

router.get('/register', function(req, res) {
  if(req.session.authenticated) {
    return res.redirect('/home');
  } 

  res.render('pages/auth/register', {
    isAuthenticated: false
  });
});

router.get('/home', isAuthenticated, function(req, res) {
  var role = req.session.user.role;
  sqliteService.getReportList(role, cb => {
    res.render('pages/home', {
      data: cb,
      user: req.session.user,
      isAuthenticated: true,
    });
  })
});

router.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
  res.render('pages/admin/dashboard', {
    user: req.session.user,
    isAuthenticated: true,
  });
});

router.get('/users', isAuthenticated, isAdmin, (req, res) => {
  res.render('pages/admin/users', {
    user: req.session.user,
    isAuthenticated: true,
  })
});

router.get('/reports', isAuthenticated, isAdmin, (req, res) => {
  res.render('pages/admin/reports', {
    user: req.session.user,
    isAuthenticated: true,
  })
})

router.get('/settings', isAuthenticated, isAdmin, (req, res) => {
  settingService.getDBConnList(cb => {
    res.render('pages/admin/setting', {
      data: cb,
      user: req.session.user,
      isAuthenticated: true
    })
  });
});

router.get('/:reportname', isAuthenticated, (req, res) => {
  settingService.getDBConnList(cb => {
    res.render('pages/reports/'+req.params.reportname, {
      user: req.session.user,
      isAuthenticated: true,
      data: cb,
    });
  });
});

function isAuthenticated(req, res, next) {
  if(req.session.authenticated) {
    return next();
  }

  return res.redirect('/');
}

function isAdmin(req, res, next) {
  if(req.session.user.role == "admin") {
    return next();
  }

  return res.redirect('/home');
}

module.exports = router;
