'use strict'

const logger = require('../config/logger')
const log = logger(module.filename)

const repository = (container) => {
  const sendEmail = (payload) => {
    return new Promise((resolve, reject) => {
      const { smtpSettings, smtpTransport, nodemailer } = container.cradle

      const transporterSettings = {
        host: smtpSettings.host,
        port: smtpSettings.port,
      }

      if (smtpSettings.service) {
        transporterSettings.service = smtpSettings.service
      } else {
        transporterSettings.host = smtpSettings.host
        transporterSettings.port = smtpSettings.port
      }
      
      if (smtpSettings.user) {
        transporterSettings.auth = {
          user: smtpSettings.user,
          pass: smtpSettings.pass
        }
      }

      const transporter = nodemailer.createTransport(smtpTransport(transporterSettings))

      const mailOptions = {
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
        replyTo: payload.replyTo,
        html: payload.body,
        attachments: payload.attachments
      }

      log.d({ transporterSettings })
      log.d({ mailOptions })

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          log.w('transporter.sendMail err', err)
          reject(new Error('An error occured sending an email, err:' + err))
        }
        transporter.close()
        log.d('transporter.sendMail done', info)
        resolve(info)
      })
    })
  }

  return Object.create({
    sendEmail
  })
}

const connect = (container) => {
  return new Promise((resolve, reject) => {
    if (!container) {
      reject(new Error('dependencies not supplied!'))
    }
    log.d('repository connect container', container)
    resolve(repository(container))
  })
}

module.exports = Object.assign({}, {connect})
