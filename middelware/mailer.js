// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dixitgadiwale@gmail.com",
    pass: "mlzg kglb gcqj wjsd", // NOT your Gmail password
  },
});

module.exports = transporter;
