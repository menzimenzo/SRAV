const path = require('path')
const root = path.dirname((require.main && require.main.filename) || process.mainModule.filename) + '/'
const logger = function(caller) {
    let name = caller.replace(root, '').split('.')
    if (name.length  > 1) {
        name.pop()
    }
    name = name.join().replace(/\//g, ':')
    const debug = require('debug')('mail-server:debug:' + name)
    const info = require('debug')('mail-server:info:' + name)
    const warn = require('debug')('mail-server:warn:' + name)
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
            // Raven.captureException(e)
        }
    }
}
module.exports = logger
