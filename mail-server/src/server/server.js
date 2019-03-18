const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const bodyparser = require('body-parser')
const cors = require('cors')
const _api = require('../routes/notification')
const logger = require('../config/logger')
const log = logger(module.filename)

const start = (container) => {
    return new Promise((resolve, reject) => {
        const { port } = container.resolve('serverSettings')
        const repo = container.resolve('repo')

        if (!repo) {
            log.w('server !repo')
            reject(new Error('The server must be started with a connected repository'))
        }
        if (!port) {
            log.w('server !port')
            reject(new Error('The server must be started with an available port'))
        }

        const app = express()
        app.use(morgan('dev'))
        app.use(bodyparser.json())
        app.use(cors())
        app.use(require('response-time')())
        app.use(helmet())
        app.use((err, req, res, next) => {
            log.w('server err', err)
            reject(new Error('Something went wrong!, err:' + err))
            res.status(400).send('Something went wrong!')
            next()
        })
        app.use((req, res, next) => {
            log.i('server done')
            req.container = container.createScope()
            next()
        })

        const api = _api.bind(null, { repo })
        api(app)

        const server = app.listen(port, () => resolve(server))
    })
}

process.on('unhandledRejection', function(err) {
    log.w('An unhandledRejection was found, the program will end. ' + err + '\nStacktrace: ' + err.stack)
    if (process.env.NODE_ENV === 'production') {
        return process.exit(1)
    }
})

process.on('uncaughtException', function(err) {
    log.w('An uncaughtException was found, the program will end. ' + err + '\nStacktrace: ' + err.stack)
    if (process.env.NODE_ENV === 'production') {
        return process.exit(1)
    }
})

module.exports = Object.assign({}, { start })
