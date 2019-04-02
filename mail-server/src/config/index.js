const {smtpSettings, serverSettings} = require('./config')
const {initDI} = require('./di')
const models = require('../models')

const requiredEnv = [] //'API_MANAGER_URL', 'APP_URL']
const unsetEnv = requiredEnv.filter((env) => !(typeof process.env[env] !== 'undefined'))

if (unsetEnv.length > 0) {
    throw new Error('Required ENV variables are not set: [' + unsetEnv.join(', ') + ']')
}

const api_manager_url = process.env.API_MANAGER_URL
const app_url = process.env.APP_URL

const init = initDI.bind(null, {serverSettings, smtpSettings, models})

module.exports = Object.assign({}, { init, api_manager_url, app_url })
