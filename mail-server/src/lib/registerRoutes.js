const { api_manager_url } = require('../config')
const logger = require('../config/logger')
const log = logger(module.filename)

const messages = require('../helpers/messages')

const _ = require('lodash')
const axios = require('axios')

const registerRoutes = routes => {
    log.i('In', routes)
    if (!routes) {
        const message = messages.MISSING_PARAM('routes')
        log.w(message)
        throw new Error(message)
    }
    if (!_.isArray(routes)) {
        log.w(messages.ROUTES_MUST_BE_AN_ARRAY)
        throw new Error(messages.ROUTES_MUST_BE_AN_ARRAY)
    }
    if (routes.length < 1) {
        log.i('Done - Aucune route à enregistrer.')
        return
    }
    const url = `${api_manager_url}/routes/multiple`
    return axios.post(url, routes)
        .then(({ data }) => {
            log.i('Done', data.message)
        })
        .catch(e => {
            log.w(e)
            setTimeout(() => registerRoutes(routes), 5000)
        })
}

module.exports = registerRoutes
