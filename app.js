require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ejs = require('ejs');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var { fork } = require('child_process');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var settingRouter = require('./routes/setting');
var reportRouter = require('./routes/reports');
var mobileRouter = require('./routes/mobile');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.engine('ejs', ejs.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Set up Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/settings', settingRouter);
app.use('/reports', reportRouter);
app.use('/mobiles', mobileRouter);
app.use('/admin', adminRouter);

// Initial execute the thread for emailing.
// Thread 1 for sending the email for report
var forkThread1 = fork(path.join(__dirname, '/controllers/thread/emailer.js'));
forkThread1.on('message', result => {
  console.log(`The Email process working on parent ID: ${result}`);
});

var sendData1 = {
  timezone: process.env.TIME_ZONE,
  dailySchedule: process.env.DAILY_SCHEDULE,
  weeklySchedule: process.env.WEEKLY_SCHEDULE,
}

forkThread1.send(sendData1);

// Thread 2 for backup
var forkThread2 = fork(path.join(__dirname, '/controllers/thread/databackup.js'));
forkThread2.on('message', result => {
  console.log(`The Data backup process working on ID: ${result}`);
});
var sendData2 = {
  shopName: process.env.SHOP_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  timeZone: process.env.TIME_ZONE,
  backupSchedule: process.env.BACKUP_SCHEDULE,
}
forkThread2.send(sendData2);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
