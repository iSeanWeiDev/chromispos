var CronGroup = require('cron-group');
var emailService = require('./../../services/email');
var warehouseMover = require('./partials/warehousemover');
var largeOrder = require('./partials/largeorder');
var dailySales = require('./partials/dailysales');

process.on('message', data => {
  function dailySchedule() {
    warehouseMover.getContent(cb => {
      if (cb.flag == true) {
        emailService.sendEmail(cb.data.subtitle, cb.data.html, callback => {
          console.log(callback);
        });
      }
    });

    largeOrder.getContent(cb => {
      if (cb.flag == true) {
        emailService.sendEmail(cb.data.subtitle, cb.data.html, callback => {
          console.log(callback);
        });
      }
    });

    dailySales.getContent(cb => {
      if (cb.flag == true) {
        emailService.sendEmail(cb.data.subtitle, cb.data.html, callback => {
          console.log(callback);
        });
      }
    });
  }

  function weeklySchedule() {
    
  }

  // Execute the Cron Group
  var group = new CronGroup({
    timezone: data.timezone
  });

  group.add({
    name: 'Send email daily',
    schedule: data.dailySchedule,
    worker: () => dailySchedule(),
  });

  group.add({
    name: 'Send email weekly',
    schedule: data.weeklySchedule,
    worker: () => weeklySchedule(),
  });

  group.on('run', ({name, runnedBy}) => {
    console.log(`${name} is runned by ${runnedBy}`);
  });
  
  group.on('complete', ({name, runnedAt, completedAt}) => {
    const prettyTime = Math.floor((completedAt - runnedAt) / 1000);
    console.log(`${name} successfully completed in ${prettyTime}s`);
  });
  

  group.on('error', ({name, err}) => {
    console.error(`${name} is completed with error\n${err.stack || err}`);
  });

  group.start();
  process.send(process.pid);
});