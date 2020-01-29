require('dotenv').config();
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
          user: process.env.SENDER_EMAIL_ADDRESS,
          pass: process.env.SENDER_EMAIL_PASSWORD
      }
});

var emailService = {};
emailService.sendEmail = sendEmail;

function sendEmail(subtitle, html, cb) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS, // sender address
    to: process.env.RECEIVER_EMAIL_ADDRESS, // list of receivers
    subject: subtitle, // Subject line
    html: html// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if(err) {
      console.log(err)
      cb({
        flag: false,
        data: err
      })
    } else {
      cb({
        flag: true,
        data: info
      })
    }
  });
}

module.exports = emailService;
