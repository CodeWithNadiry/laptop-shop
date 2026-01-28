const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY
    }
  })
)

const sendEmail = async (to, subject, htmlContent) => {
  await transporter.sendMail({
    to, 
    from: process.env.EMAIL_FROM,
    subject,
    html: htmlContent
  })
}

module.exports = sendEmail;