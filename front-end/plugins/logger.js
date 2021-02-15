const logger = function(name) {
    const debug = require('debug')('srav-frontend:debug:' + name)
    const info = require('debug')('srav-frontend:info:' + name)
    const warn = require('debug')('srav-frontend:warn:' + name)
    return {
        d: function(message, ...args) {
            if (debug.enabled) {
                debug('[DEBUG]', message, ...args)
            }
        },
        i: function(message, ...args) {
            if (debug.enabled) {
                debug('[INFO]', message, ...args)
            } else if (info.enabled) {
                info('[INFO]', message)
            }
        },
        w: function(...args) {
            if (debug.enabled) {
                debug('[WARN]', ...args)
            } else if (info.enabled) {
                info('[WARN]', ...args)
            } else if (warn.enabled) {
                warn('[WARN]', ...args)
            }
        }
    }
}

export default logger
