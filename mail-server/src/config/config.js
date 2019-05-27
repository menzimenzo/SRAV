const serverSettings = {
  port: process.env.PORT || 3000
}

// as a better practice we can pass this values via env variables
const smtpSettings = {
  service: process.env.SMTP_SERVICE ? process.env.SMTP_SERVICE: null,
  host: process.env.SMTP_SERVICE ? null : process.env.SMTP_HOST,
  port: process.env.SMTP_SERVICE ? null : process.env.SMTP_PORT,
  user: process.env.SMTP_USER ? process.env.SMTP_USER: null,
  pass: process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD: null,
  sender: process.env.SENDER_EMAIL ? process.env.SENDER_EMAIL: null,
  proxy_user: process.env.PROXY_USER ? process.env.PROXY_USER : null
}

module.exports = Object.assign({}, { serverSettings, smtpSettings })
