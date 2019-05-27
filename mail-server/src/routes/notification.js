'use strict'
const status = require('http-status')
const logger = require('../config/logger')
const log = logger(module.filename)

module.exports = ({repo}, app) => {
  app.post('/notification/sendEmail', (req, res, next) => {
    const { validate, smtpSettings } = req.container.cradle
    log.i('notification.post')
    validate(req.body, 'email')
      .then(payload => {
        payload.from = payload.from || smtpSettings.sender
        log.d('notification.post payload', { payload })
        if (process.env.NODE_ENV !== 'production' && process.env.PROXY_USER) {
          const header = `<hr/><p>Le message a été automatiquement édité car envoyé via un serveur de DEV</p>
          <p>Informations initiales : </p>
          <ul>
            <li>From : ${payload.from || 'Non renseigné'}</li>
            <li>To : ${payload.to || 'Non renseigné'}</li>
            <li>ReplyTo : ${payload.replyTo || 'Non renseigné'}</li>
            </ul>
          <hr/>`
          payload.body = header + payload.body
          payload.from = process.env.SENDER_EMAIL
          payload.to = process.env.PROXY_USER
          payload.replyTo = process.env.SENDER_EMAIL
          log.d({ payload })
        } else if (process.env.NODE_ENV !== 'production') {
          return
        }
        return repo.sendEmail(payload)
      })
      .then(ok => {
        log.i('notification.post done')
        res.status(status.OK).json({ msg: 'ok' })
      })
      .catch(err => {
        log.w('notification.post err', err)
        next(err);
      })
  })
}
