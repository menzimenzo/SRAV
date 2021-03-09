const pgPool = require('../pgpool').getPool()
const crypto = require('crypto');
const {formatUtilisateur} = require('../utils/utils')

const logger = require('../utils/logger')
const log = logger(module.filename)

const pwdLogin = async function(req, res) {
    const { mail, password } = req.body
    log.i('In', { mail })
    if(!mail) {
        log.w('mail is missing')
        return res.status(400).json({ message: 'Le courriel manque à la requête.'});
    }
    if(!password) {
        log.w('password is missing.')
        return res.status(400).json({ message: 'Aucun mot de passe fournit pour identification.'});
    }

    const requete = `SELECT * FROM utilisateur WHERE uti_mail='${mail}'`;
    const crypted = await crypto.createHash('md5').update(password).digest('hex');

    pgPool.query(requete, (err, result) => {
        if (err) { 
            log.w(err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'utilisateur');
        }
        else {
            log.d('Getting user')
            const user = result.rows && result.rows.length && result.rows[0];
            if (!user) {
                log.w('Utilisateur inexistant')
                return res.status(404).json({ message: 'L\'utilisateur n\'existe pas' });
            }

            if(user.uti_pwd && user.uti_pwd === crypted) {
                log.i('Done')
                req.session.user = user
                req.accessToken = crypted;
                req.session.accessToken = crypted;
                log.i('Done', { user })            
                return res.json({ user: formatUtilisateur(user) });
            } else {
                return res.status(400).json({ message: 'Mot de passe incorrect' });
            }
        }
    })
}

module.exports =  { pwdLogin };