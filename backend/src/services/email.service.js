import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

function send({ email, subject, html }) {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
}

function sendActivationEmail(email, token) {
  const href = `${process.env.CLIENT_HOST}/activate/${token}`
  const html = `
  <h1>Activate account</h1>
  <a href="${href}">${href}</a>
`
  return send({ email, html, sunbect: 'Activate' })
}

const info = await transporter.sendMail({
  to: 'fevah39249@reebsd.com',
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>', // html body
});

console.log('Message sent: %s', info.messageId);

export const emailService = {
  sendActivationEmail,
  send
}
