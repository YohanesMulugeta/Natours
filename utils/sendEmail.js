const nodemailer = require('nodemailer');

async function sendMail(to, subject, text) {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, MAIL_SECTURE } =
    process.env;

  // 1)create transporter
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: MAIL_SECTURE,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  // 2) configuret mailer options
  const messageOpt = {
    from: 'I yimechen <jojo@lala.com>',
    to,
    subject,
    text,
  };

  // 3) send mail
  const info = await transporter.sendMail(messageOpt);

  return info;
}

module.exports = sendMail;
