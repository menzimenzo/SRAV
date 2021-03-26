const pgPool = require('../pgpool').getPool()
const crypto = require('crypto');
const {formatUtilisateur} = require('../utils/utils')

const logger = require('../utils/logger')
const log = logger(module.filename)

module.exports = async function(req, res) {
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
            const user = result.rowCount === 1 && result.rows[0];
            if (!user) {
                log.w('Utilisateur inexistant')
                return res.status(404).json({ message: 'Mail ou mot de passe incorrect' });
            }

            if(user.uti_pwd && user.uti_pwd === crypted) {
                if(!user.pwd_validated) {
                    return res.status(400).json({ message: 'En attente de confirmation du mot de passe.' });
                }    
                req.session.user = user
                req.accessToken = crypted;
                req.session.accessToken = crypted;
                log.i('Done', { user })            
                return res.json({ user: formatUtilisateur(user) });
            } else {
                return res.status(404).json({ message: 'Mail ou mot de passe incorrect' });
            }
        }
    })
}
