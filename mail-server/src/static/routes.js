const { app_url } = require('../config') 

module.exports = [{
    'service': 'mail-server',
    'url': '/mail-server', 
    'targets': [app_url],
    'pathRewrite': {
        'from': '^/mail-server',
        'to': '/'
    }
}]
