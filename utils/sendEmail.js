const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Yohanes Mulugeta <${process.env.EMAIL_FROM}>`;
  }

  createNewTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 'space';
    }
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: process.env.MAIL_SECTURE,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    // SENDTHE ACTUAL EMAIL
    // 1) render HTML based on the pug temlate
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      { firstName: this.firstName, url: this.url, subject }
    );

    // 2) Define the email options
    const messageOpt = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    // 3) create a transport and send email
    await this.createNewTransport().sendMail(messageOpt);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family.');
  }

  async sendResetPassword(resetToken) {
    this.url = `${this.url}/${resetToken}`;

    await this.send(
      'reset',
      'Your password reset link. (Valid for 10 minutes)'
    );
  }
};
