var express = require('express');
var router = express.Router();
var reportService = require('../services/report');

/* GET home page. */
router.get('/', function(req, res) {
  reportService.getReportList('initial', cb => {
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
  reportService.getReportList(role, cb => {
    res.render('pages/home', {
      data: cb,
      user: req.session.user,
      isAuthenticated: true,
    });
  })
});

router.get('/:reportname', isAuthenticated, (req, res) => {
  res.render('pages/reports/'+req.params.reportname, {
    user: req.session.user,
    isAuthenticated: true,
  })
});

function isAuthenticated(req, res, next) {
  if(req.session.authenticated) {
    return next();
  }

  return res.redirect('/');
}

module.exports = router;
