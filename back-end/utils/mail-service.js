const axios = require('axios')
const config = require('../config')
const MAIL_URL = config.MAIL_URL
const SENDER_EMAIL = config.SENDER_EMAIL
const sendNotificationUrl = MAIL_URL + '/notification/sendEmail'

const logger = require('../utils/logger')
const log = logger(module.filename)

module.exports = {
    sendEmail: function(payload){
        payload.from = SENDER_EMAIL
        payload.replyTo = SENDER_EMAIL
        return  axios.post(sendNotificationUrl,  payload).then(() => {
            log.i('sendStatusNotification - Done', {payload})
        })
        .catch(err => {
            log.w('sendStatusNotification', err)
        })
    },
    sendValidationMail: ({ url, email, siteName, pwd, id }) => {
        log.i('sendValidationMail - In', { mail_url: sendNotificationUrl, email, url, siteName, pwd, id })
        if (!email || !url) {
            const message = messages.MISSING_PARAM(!email ? 'email' : 'url')
            log.w(`sendValidationMail - ${message}`)
            return res.status(statusCode).json({ message })
        }

        // Add / at the end if not present
        if (url && url.substr(-1) !== '/') {
            url = url + '/'
        }

        log.d('sendValidationMail - sending validation mail')
        const params = {
            from: SENDER_EMAIL,
            replyTo: SENDER_EMAIL,
            to: email,
            subject: `Validez votre email "${siteName}"`,
            body: `
            <p>Bonjour,</p>

            <p>Vous recevez ce mail car vous vous êtes inscrit sur le site ${siteName}</p>

            <p>Afin de bénéficier de toutes les fonctionnalités, veuillez valider votre email en cliquant sur le lien suivant:</p>

            <p><a href="${url}validate/${pwd}?id=${id}">J'active mon compte.</a></p>
            `
        }
        log.d('sendValidationMail post email', { sendNotificationUrl, params })

        return axios.post(sendNotificationUrl, params)
            .then(() => {
                log.i('sendValidationMail - Done')
            })
            .catch(error => log.w('sendValidationMail - error on sending mail',{ error, method: 'sendValidationMail' }))
    },
}