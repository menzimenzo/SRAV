const pgPool = require('../pgpool').getPool()
const {formatUtilisateur} = require('../utils/utils')

const logger = require('../utils/logger')
const log = logger(module.filename)

const loginFromAuthServer = async function(req, res) {
    log.i('In', req.params)
    const authId = req.params && req.params.id
    const token = req.query && req.query.token
    if(!authId) {
        log.w('uauthId is missing')
        return res.status(400).json({ message: 'L\'identifiant manque à la requête.'});
    }
    if(!token) {
        return res.status(400).json({ message: 'Le Token est manquant.'});
    }

    const requete = `SELECT * FROM utilisateur WHERE uti_authid='${authId}'`;

    pgPool.query(requete, (err, result) => {
        if (err) { 
            log.w(err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'utilisateur');
        }
        else {
            log.d('Getting user')
            const user = result.rows && result.rows.length && result.rows[0];
            if (!user) {
                return res.status(400).json({ message: 'Utilisateur inexistant' });
            }
            req.session.user = user
            req.accessToken = token;
            req.session.accessToken = token;
            res.json({ user: formatUtilisateur(user) });
        }
    })
}

module.exports =  { loginFromAuthServer };