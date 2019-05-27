const axios = require('axios')
const config = require('../config')
const MAIL_URL = config.MAIL_URL
const SENDER_EMAIL = config.SENDER_EMAIL
const sendNotificationUrl = MAIL_URL + '/notification/sendEmail'

module.exports = {
    sendEmail: function(payload){
        payload.from = SENDER_EMAIL
        payload.replyTo = SENDER_EMAIL
        return  axios.post(sendNotificationUrl,  payload).then(() => {
            console.log('sendStatusNotification - Done', {payload})
        })
        .catch(err => {
            console.log('sendStatusNotification', err)
        })
    }
}