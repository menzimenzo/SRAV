const logger = require('../utils/logger')
const log = logger(module.filename)

const pgPool = require('../pgpool').getPool()
const crypto = require('crypto');
const { formatEmail } = require('../utils/utils')

module.exports = async ({ mail }) => {
    log.i('In', mail)
    if (!mail) {
        log.w('Mail manquant')
        throw new Error('Mail manquant pour effectuer la requête.')
    }
    mail = formatEmail(mail)
    
    const userQuery = await pgPool.query(`SELECT uti_mail, uti_id, uti_pwd FROM utilisateur WHERE uti_mail='${mail}'`).catch(err => {
        log.w(err)
        throw err
    })
    const user= userQuery.rowCount === 1 && userQuery.rows[0]

    if(!user) {
        log.w('Utilisateur inexistant.')
        throw new Error("L'utilisateur n'existe pas.")    
    }

    log.i('Done - returning crypted infos')
    return {
        mail,
        cryptedi: await crypto.createHash('md5').update(user.uti_id.toString()).digest('hex'),
        cryptedp: user.uti_pwd
    }
}
