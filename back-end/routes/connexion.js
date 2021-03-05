const express = require('express');
const router = express.Router();

const logger = require('../utils/logger')
const log = logger(module.filename)

const pgPool = require('../pgpool').getPool();
const config = require('../config');
const {sendEmail} = require('../utils/mail-service')
const {getAuthorizationUrl, getLogoutUrl, formatUtilisateur} = require('../utils/utils')
const bodyParser = require('body-parser');
var moment = require('moment');
const { oauthCallback } = require('../controllers/oauthCallback')
const { loginFromAuthServer } = require('../controllers/loginFromAuthServer')
moment().format();


router.get('/login', (req, res) => {
    log.i('::login via France Connect')
    return res.send({url: getAuthorizationUrl()});
});

router.get('/login-from-auth/:id', loginFromAuthServer)

// Gère une connexion validée avec FC
router.get('/callback', oauthCallback);

// Valide un compte utilisateur avec les infomations complémentaires
router.post('/verify', async (req,res) => {
    log.i('::verify - In')
    if(!(req.body.id || req.body._id)){
        log.w('::verify - Aucun ID à ajouter en base.') 
        return res.sendStatus(500)
    }
    var wasValidated = req.body.validated
    var user = formatUtilisateur(req.body, false)
    
    if (user.str_id == 99999) {
        // La structure spécifiée n'existe peut être pas encore
        const selectRes = await pgPool.query("SELECT str_id from structure where str_typecollectivite is not null and str_libelle = $1",
            [user.libelleCollectivite]).catch(err => {
                console.log(err)
                throw err
            })

        var libelleCourt = ''
        if (!selectRes.rows[0]) {
            // Si la structure n'existe pas on la créé
            console.log('strucure a créer')
            if (user.typeCollectivite == 1) {
                libelleCourt = 'COM'
            }
            if (user.typeCollectivite == 2) {
                libelleCourt = 'DEP'
            }
            if (user.typeCollectivite == 3) {
                libelleCourt = 'EPCI'
            }
            const insertRes = await pgPool.query("INSERT INTO structure (str_libellecourt,str_libelle,str_actif,str_federation,str_typecollectivite) \
         VALUES ($1,$2,'true','false',$3) RETURNING *",
                [libelleCourt,user.libelleCollectivite, user.typeCollectivite]).catch(err => {
                    console.log(err)
                    throw err
                })
            idStructure = insertRes.rows[0].str_id
        }
        else {
            idStructure = selectRes.rows[0].str_id
            console.log('structure déjà existante.Str_id : '+idStructure);
        }
    }

    if(!user.uti_authid && !user.uti_tockenfranceconnect) {
        log.w('::verify - Le user n\'est inscrit dans aucune base.')   
        throw new Error("L'utilisateur n'existe ni auprès du serveur d'authentification ni auprès de France Connect")
    }

    // Vérifier si l'email est déjà utilisé en base.
    const mailExistenceQuery = await pgPool.query(`SELECT uti_mail,uti_authid FROM utilisateur WHERE uti_mail='${user.uti_mail}'`).catch(err => {
        log.w(err)
        throw err
    })

    if(mailExistenceQuery && mailExistenceQuery.rowCount > 0 && mailExistenceQuery.rows[0].uti_authid) {
        log.w('Vérifications complémentaires nécessaires avant ajout en base. ')
        return res.status(200).json({ existingUser: formatUtilisateur(mailExistenceQuery.rows[0]) })
    } 

    let bddRes
    if(req.body._id) {
        log.d('::verify - Nouveau user, authentifié depuis authserver, à ajouter en base')        
        bddRes = await pgPool.query(
            'INSERT INTO utilisateur(pro_id, stu_id, str_id, uti_mail, uti_nom, uti_prenom, uti_datenaissance, validated, uti_structurelocale, uti_authid)\
            VALUES($1, $2, $3, $4, upper($5), $6, $7, $8, $9, $10) RETURNING *'
            , [3, 1, user.str_id, user.uti_mail, user.uti_nom, user.uti_prenom, user.uti_datenaissance, true, user.uti_structurelocale, user.uti_authid]
          ).catch(err => {
            console.log(err)
            throw err
          })
    } else {
        log.d('::verify - Mise à jour de l\'utilisateur existant')        
        bddRes = await pgPool.query("UPDATE utilisateur SET str_id = $1, uti_mail = $2, uti_structurelocale = $3, validated = true \
             WHERE uti_id = $4 RETURNING *", 
             [user.str_id, user.uti_mail, user.uti_structurelocale, user.uti_id]).catch(err => {
                 console.log(err)
                 throw err
             })
    }
    // Envoie de l'email de confirmation
    if(!wasValidated){
        log.d('::verify - Mail de confirmation envoyé.')
        sendEmail({
            to: user.uti_mail,
            subject: 'création compte savoir rouler à vélo',
            body: `<p>Bonjour,</p>
                <p>Votre compte « Intervenant Savoir Rouler à Vélo » a bien été créé. <br/><br/>
                Nous vous invitons à y renseigner les informations relatives à la mise en œuvre de chacun des 3 blocs du socle commun du SRAV.<br/>
                Le site <a href="www.savoirrouleravelo.fr">www.savoirrouleravelo.fr</a> est à votre disposition pour toute information sur le programme Savoir Rouler à Vélo.<br/></p>`
        })
    }

    req.session.user = bddRes.rows[0]
    user = formatUtilisateur(bddRes.rows[0])
    log.i('::verify - Done')
    return res.send({user})
})

// Nouveau user sur AUTH-SERVER mais qui est a déjà un pass FC.
// Vérifie l'existence d'un email en base pour adapter les infos concernant le user suivant la méthode de connexion.
router.post('/france-connect-identified', async (req,res) => {
    const mail = req.body && req.body.user && req.body.user.mail
    const authId = req.body && req.body.user && req.body.user._id
    log.i('::FC-identified - In', { mail, authId })

    if(!mail) {
        throw new Error("Le paramètre 'mail' manque pour effectuer la vérification.")
    }
    const requete = `SELECT * FROM utilisateur WHERE uti_mail='${mail}'`
    const bddRes = await pgPool.query(requete).catch(err => {
        log.w('::FC-identified - Erreur pendant la vérification de l\'email', err)
        throw err
    })
    const emailAlreadyExist = bddRes && bddRes.rowCount && bddRes.rowCount > 0
    const existingUser = bddRes && bddRes.rows && bddRes.rows[0]

    if(emailAlreadyExist && !(existingUser && existingUser.uti_authid)) {
        log.d('::FC-identified - email existe mais n\'a pas d\'authid')
        const bddUpdate =  await pgPool.query("UPDATE utilisateur SET uti_authid = $1\
        WHERE uti_id = $2 RETURNING *", 
        [authId, existingUser.uti_id]).catch(err => {
            log.w('::FC-identified - Erreur pendant l\'update des infos du user', err)
            throw err
        })
        
        const updatedUser = bddUpdate.rows && bddUpdate.rows[0]
        log.d('::FC-identified - Done, renvois du user mis à jour', updatedUser)
        req.session.user = updatedUser
        req.accessToken = updatedUser.uti_tockenfranceconnect;
        req.session.accessToken = updatedUser.uti_tockenfranceconnect;
        return res.send(formatUtilisateur(updatedUser))
    } else {
        log.d('::FC-identified - Done, nouveau user à ajouter.')
        return res.send('New Entry')
    }
})

// Nouveur user FC mais qui a déjà une connexion AUTH-SERVER
// Vérification des duplicatas en base sur base de tokenFC et update du user existant
router.put('/auth-identified', async (req,res) => {
    const user = req.body && req.body.user
    const mail = user && user.mail
    const tokenFc = user && user.tokenFc
    const authId = user && user.authId
    log.i('::auth-identified - In', {mail , authId, tokenFc})

    await pgPool.query(`DELETE FROM utilisateur WHERE uti_tockenfranceconnect='${tokenFc}' RETURNING *`).catch(err => {
        log.w('::auth-identified - Erreur pendant la suppression des users.', err)
        throw err
    })

    const bddUpdate =  await pgPool.query("UPDATE utilisateur SET uti_tockenfranceconnect = $1, uti_mail = $2, uti_structurelocale= $3, str_id = $4, uti_prenom = $5, uti_nom = $6, uti_datenaissance = $7 \
    WHERE uti_authid = $8 RETURNING *", 
    [tokenFc, mail, user.structureLocale, user.structureId, user.prenom, user.nom, user.dateNaissance, authId]).catch(err => {
        log.w('::auth-identified - Erreur pendant l\'update des infos du user', err)
        throw err
    })
    
    const updatedUser = bddUpdate.rows && bddUpdate.rows[0]
    log.d('::FC-identified - Done, renvois du user mis à jour', updatedUser)
    req.session.user = updatedUser
    req.accessToken = updatedUser.uti_tockenfranceconnect;
    req.session.accessToken = updatedUser.uti_tockenfranceconnect;
    return res.send(formatUtilisateur(updatedUser))
})

// Envoie l'utilisateur de la session
router.get('/user', (req,res) => {
    if(!req.session || !req.session.user || !req.session.accessToken){
        return res.sendStatus(404)
    }
    return res.send(formatUtilisateur(req.session.user))
})

// Envoie l'url FC pour se déconnecter
router.get('/logout', async(req, res) => {
    log.i('::logout - In')
    let url
    if(req.session.idToken) url = await getLogoutUrl(req)
    req.session && req.session.destroy()
    res.send({url});
});

// Nettoie la session de l'utilisateur
router.get('/logged-out', (req, res) => {
    log.i('::logged-out - In')    
    // Resetting the id token hint.
    req.session.idToken = null;
    // Resetting the userInfo.
    req.session.user = null;
    return res.send('OK')
});

router.get('/', function (req, res) {
    res.send('Ceci est la route de connexion');
});

module.exports = router;