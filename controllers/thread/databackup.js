require('dotenv').config();
var mysql = require('mysql2');
var CronGroup = require('cron-group');
var dataBackupCtl = require('./partials/databackup');

process.on('message', data => {
  var dbInfo = data;
  function dailySchedule() {
    var dbConn = mysql.createConnection({
      host: dbInfo.dbHost,
      user: dbInfo.dbUsername,
      password: dbInfo.dbPassword,
      database: dbInfo.dbName,
      port: 3306,
    });

    dataBackupCtl.getData(callback => {
      if (callback.flag == true && callback.data.length > 0) {
        dbConn.query(`TRUNCATE TABLE ${process.env.DB_TABLE_NAME}`, err => {
          if (err) {
            console.log(err);
          }
        });

        var strInsertData = ``;
        for (var obj of callback.data) {
          strInsertData += `('${obj.CODE}', '${obj.PRODUCTNAME}', ${obj.PRICESELL}, '${obj.CATEGORYID}', '${obj.SUPPLIERID}', ${obj.UNITS}, '${obj.DATA30}', '${obj.DATA60}','${obj.DATA90}'),`
        }

        var insertQuery = `INSERT INTO ${process.env.DB_TABLE_NAME} 
                            (barcode, name, price, category, supplier, total_qty, day30, day60, day90)
                          VALUES ` + strInsertData;
        insertQuery = insertQuery.substring(0, insertQuery.length - 1);

        dbConn.query(insertQuery, (insertErr) => {
          console.log(insertErr);
        });

        dbConn.end();
      }
      
    });
    
  }
  // Execute the Cron Group
  var group = new CronGroup({
    timezone: data.timeZone
  });

  group.add({
    name: 'Send email daily',
    schedule: data.backupSchedule,
    worker: () => dailySchedule(),
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