const pgPool = require('../pgpool').getPool()
const crypto = require('crypto');
const {formatUtilisateur} = require('../utils/utils')

const logger = require('../utils/logger')
const log = logger(module.filename)
const {postTrace} = require('../controllers');

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

    //const requete = `SELECT * FROM utilisateur WHERE uti_mail='${mail}'`;
    const requete = `SELECT uti.*, str.* FROM utilisateur uti \
    left join uti_str ust on ust.uti_id = uti.uti_id \
    left join structure str on str.str_id = ust.str_id \
    WHERE uti.uti_mail='${mail}' limit 1`;
    
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
                log.d('On verifie si le nom est renseigné')
                // Correction concernant la finalisation de la création du compte (Report de GC AAQ adapté SRAV)
                if(!user.uti_nom) {
                    log.d('Le nom n est pas renseigné')
                    return res.status(200).json({message:'Veuillez terminer votre inscription', redirect:'/connexion/inscription', user: formatUtilisateur(user)})
                }
                if(!user.pwd_validated) {
                    return res.status(400).json({ message: 'En attente de confirmation du mot de passe.' });
                }    
                req.session.user = user
                req.accessToken = crypted;
                req.session.accessToken = crypted;

/*
                const params = {
                    tra_action : 'U',
                    tta_type_id: 1,
                    tra_objet: 'UTILISATEUR',
                    tra_objet_id: user.id,
                    tra_contenu: user
                    }
                postTrace(params)
*/
                log.i('Done', { user })            
                return res.json({ user: formatUtilisateur(user) });
            } else {
                return res.status(404).json({ message: 'Mail ou mot de passe incorrect' });
            }
        }
    })
}
