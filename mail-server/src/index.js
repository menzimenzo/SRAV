'use strict'
const {EventEmitter} = require('events')
const server = require('./server/server')
const repository = require('./repository/repository')
const di = require('./config')
const mediator = new EventEmitter()
const routes = require('./static/routes')
const logger = require('./config/logger')
const log = logger(module.filename)

log.i('--- Notification Service ---')
log.i('Connecting to notification repository...')

mediator.on('di.ready', (container) => {
  log.i('di.ready', container)
  log.d('Registre routes', routes)
  repository.connect(container)
    .then(repo => {
      log.d('Connected. Starting Server', repo)
      container.registerValue({repo})
      return server.start(container)
    })
    .then(app => {
      log.d(`Server started succesfully, running on port: ${container.cradle.serverSettings.port}.`, app)
      app.on('close', () => {
        container.resolve('repo').disconnect()
      })
    })
})

di.init(mediator)

mediator.emit('init')
