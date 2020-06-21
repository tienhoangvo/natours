const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

const {
 NODE_ENV,
 EMAIL_HOST,
 EMAIL_PORT,
 EMAIL_USERNAME,
 EMAIL_PASSWORD,
 EMAIL_FROM,
 SENDGRID_USERNAME,
 SENDGRID_PASSWORD,
} = process.env;

console.log({
 SENDGRID_PASSWORD,
 SENDGRID_USERNAME,
});

module.exports = class Email {
 constructor(user, url) {
  this.to = user.email;
  this.firstName = user.name.split(' ')[0];
  this.url = url;
  this.from = EMAIL_FROM;
 }

 newTransport() {
  //   if (NODE_ENV === 'development') {
  //    // Sendgrid
  //    return nodemailer.createTransport({
  //     host: EMAIL_HOST,
  //     port: EMAIL_PORT,
  //     auth: {
  //      user: EMAIL_USERNAME,
  //      pass: EMAIL_PASSWORD,
  //     },
  //    });
  //   }

  return nodemailer.createTransport({
   service: 'SendGrid',
   auth: {
    user: SENDGRID_USERNAME,
    pass: SENDGRID_PASSWORD,
   },
  });
 }
 // Send the actual email;
 async send(template, subject) {
  // 1) Render HTML based on the pug template
  const html = pug.renderFile(
   `${__dirname}/../views/email/${template}.pug`,
   {
    firstName: this.firstName,
    url: this.url,
    subject,
   }
  );

  // 2) Define the email options
  const mailOptions = {
   from: this.from,
   to: this.to,
   subject: subject,
   html,
   text: htmlToText.fromString(html),
  };

  // 3) Create a transport and send email
  await this.newTransport().sendMail(mailOptions);
 }

 async sendWelcome() {
  await this.send(
   'welcome',
   'Welcome to the Natours family!'
  );
 }

 async sendPasswordReset() {
  await this.send(
   'passwordReset',
   'Your password reset token (valid for only 10 minutes)'
  );
 }
};
