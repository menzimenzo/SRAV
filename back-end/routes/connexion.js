const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const logger = require('../utils/logger')
const log = logger(module.filename)

const pgPool = require('../pgpool').getPool();
const config = require('../config');
const {sendEmail, sendValidationMail, sendResetPasswordMail } = require('../utils/mail-service')
const {getAuthorizationUrl, getLogoutUrl, formatUtilisateur} = require('../utils/utils')
const bodyParser = require('body-parser');
var moment = require('moment');
const { oauthCallback, pwdLogin, generateForgotPasswordEncryption } = require('../controllers/index')
const {postTrace} = require('../controllers');

moment().format();

router.get('/login', (req, res) => {
    log.i('::login via France Connect')
    return res.send({url: getAuthorizationUrl()});
});

// Gère une connexion via mot de passe.
router.post('/pwd-login', pwdLogin)

// Gère une connexion validée avec FC
router.get('/callback', oauthCallback);

// Valide un compte utilisateur avec les infomations complémentaires
router.post('/verify', async (req,res) => {
    log.i('::verify - In')
    if(!req.body.id){
        log.w('::verify - Aucun ID à ajouter en base.') 
        return res.sendStatus(500)
    }
    var wasValidated = req.body.validated
    const tokenFc = req.body.tokenFc
    var user = formatUtilisateur(req.body, false)
    /*
    if (user.str_id == 99999) {
        // La structure spécifiée n'existe peut être pas encore
        const selectRes = await pgPool.query("SELECT str_id from structure where str_typecollectivite is not null and str_libelle = $1",
            [user.libelleCollectivite]).catch(err => {
                log.w(err)
                throw err
            })

        var libelleCourt = ''
        if (!selectRes.rows[0]) {
            // Si la structure n'existe pas on la créé
            log.d('::verify - structure a créer')
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
                    log.w(err)
                    throw err
                })
                user.str_id = insertRes.rows[0].str_id
            log.d('::verify - structure créée. Str_id : '+user.str_id );
        }
        else {
            user.str_id = selectRes.rows[0].str_id
            log.d('::verify - structure déjà existante. Str_id : '+user.str_id );
        }
        user.uti_structurelocale = user.libelleCollectivite
    }
*/
    // Vérifier si l'email est déjà utilisé en base.
    const mailExistenceQuery = await pgPool.query(`SELECT uti_mail,uti_pwd, uti_tockenfranceconnect FROM utilisateur WHERE uti_mail='${user.uti_mail}'`).catch(err => {
        log.w(err)
        throw err
    })

    if(mailExistenceQuery && mailExistenceQuery.rowCount > 0 && mailExistenceQuery.rows[0].uti_pwd && tokenFc) {
        log.w('Vérifications complémentaires nécessaires avant ajout en base. ')
        return res.status(200).json({ existingUser: formatUtilisateur(mailExistenceQuery.rows[0]) })
    } 

    log.d('::verify - Mise à jour de l\'utilisateur existant')    

/*
        uti_structurelocale = $2, \
        user.uti_structurelocale, 
*/
    const bddRes = await pgPool.query
    ("UPDATE utilisateur \
        SET uti_mail = lower($1), \
        uti_nom = $2, \
        uti_prenom = $3, \
        validated = true, \
        uti_siteweb = $4, \
        uti_adresse = $5, \
        uti_complementadresse = $6, \
        uti_com_codeinsee = $7, \
        uti_com_codepostal = $8, \
        uti_mailcontact = $9, \
        uti_telephone = $10, \
        uti_autorisepublicarte = $11 \
    WHERE uti_id = $12 RETURNING *", 
        [user.uti_mail, 
        user.uti_nom, 
        user.uti_prenom, 
        user.uti_siteweb,
        user.uti_adresse,
        user.uti_complementadresse,
        user.uti_com_codeinsee,
        user.uti_com_codepostal,
        user.uti_mailcontact,
        user.uti_telephone,
        Boolean(user.uti_autorisepublicarte),
        user.uti_id
    ]
    ).catch(err => {
        log.w(err)
        throw err
        })
        /*
    ("UPDATE utilisateur \
        SET str_id = $1, \
        uti_mail = lower($2), \
        uti_structurelocale = $3, \
        uti_nom = $4, \
        uti_prenom = $5, \
        validated = true, \
        uti_siteweb = $7, \
        uti_adresse = $8, \
        uti_complementadresse = $9, \
        uti_com_codeinsee = $10, \
        uti_com_codepostal = $11, \
        uti_mailcontact = $12, \
        uti_telephone = $13, \
        uti_autorisepublicarte = $14 \
    WHERE uti_id = $6 RETURNING *", 
        [user.str_id, 
        user.uti_mail, 
        user.uti_structurelocale, 
        user.uti_nom, 
        user.uti_prenom, 
        user.uti_id,
        user.uti_siteweb,
        user.uti_adresse,
        user.uti_complementadresse,
        user.uti_com_codeinsee,
        user.uti_com_codepostal,
        user.uti_mailcontact,
        user.uti_telephone,
        Boolean(user.uti_autorisepublicarte)]
    ).catch(err => {
        log.w(err)
        throw err
        })

*/
    /*
     const requete = `UPDATE utilisateur 
        SET uti_mail = lower($1),
        uti_nom = $2, 
        uti_prenom = $3, 
        uti_structurelocale = $4,
        uti_siteweb = $5,
        uti_adresse = $6,
        uti_complementadresse = $7,
        uti_com_codeinsee = $8,
        uti_com_codepostal = $9,
        uti_mailcontact = $10,
        uti_telephone = $11,
        uti_autorisepublicarte = $12
        WHERE uti_id = ${id}
        RETURNING *
        ;`    
    pgPool.query(requete,
        [user.mail,
        user.nom,  
        user.prenom, 
        user.structureLocale,
        user.siteweb,
        user.adresse,
        user.compladresse,
        user.codeinsee,
        user.codepostal,
        user.mailcontact,
        user.telephone,
        Boolean(user.autorisepublicarte)
        ],
    */
    
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
        
    user = formatUtilisateur(bddRes.rows[0])
    req.session.user = bddRes.rows[0]
    
    const isPwdConfirmed = bddRes.rows[0] && bddRes.rows[0].uti_pwd && bddRes.rows[0].pwd_validated
    if(!isPwdConfirmed && !user.tokenFc) {
        log.d('::verify - mot de passe à valider.')
        await sendValidationMail({
            email: bddRes.rows[0].uti_mail,
            pwd: bddRes.rows[0].uti_pwd,
            id: bddRes.rows[0].uti_id,
            siteName: 'Savoir Rouler à Vélo',
            url: `${config.FRONT_DOMAIN}`,
        })
        .then(() => {
            log.d('Mail de confirmation envoyé')
            req.session.user = null
        })
        .catch(err => {
            log.w(err)
            throw err
        })
    }
/*
    const params = {
        tra_uti_id: user.id,
        tra_action : 'U',
        tta_id: 12,
        tra_objet: 'UTILISATEUR',
        tra_objet_id: user.id,
        tra_contenu: user
        }

    postTrace(params)
*/

    log.i('::verify - Done')
    return res.send({user, isPwdConfirmed })
})

// Nouveur user FC mais qui a déjà une connexion via mot de passe.
// Vérification des duplicatas en base sur base de tokenFC et update du user existant
router.put('/confirm-profil-infos', async (req,res) => {
    const user = req.body && req.body.user
    const mail = user && user.mail
    const tokenFc = user && user.tokenFc
    const candidate = user && user.password && await crypto.createHash('md5').update(user.password).digest('hex')
    log.i('::confirm-profil-infos - In', {mail , candidate, tokenFc})

    const authConfirmationQuery = await pgPool.query(`SELECT * FROM utilisateur WHERE uti_mail='${mail}'`).catch(err => {
        log.w('::confirm-profil-infos - Erreur pendant la suppression des users.', err)
        throw err
    })

    const existingUser = authConfirmationQuery.rows && authConfirmationQuery.rows[0]
    const isMatch = existingUser.uti_pwd && existingUser.uti_pwd === candidate
    if(!isMatch) {
        log.w('::confirm-profil-infos - Les mots de passes ne matchent pas.')
        return res.status(400).json({message: 'Le mot de passe fourni est incorrect ou l\'utilisateur n\'en possède pas. Veuillez contacter l\'assistance.'});        
    }

    await pgPool.query(`DELETE FROM utilisateur WHERE uti_tockenfranceconnect='${tokenFc}' RETURNING *`).catch(err => {
        log.w('::confirm-profil-infos - Erreur pendant la suppression des users.', err)
        throw err
    })
    
    const bddUpdate =  await pgPool.query("UPDATE utilisateur SET uti_tockenfranceconnect = $1, uti_mail = $2, uti_prenom = $3, uti_nom = $4 \
    WHERE uti_id = $5 RETURNING *", 
    [tokenFc, mail, user.prenom, user.nom, existingUser.uti_id]).catch(err => {
        log.w('::confirm-profil-infos - Erreur pendant l\'update des infos du user', err)
        throw err
    })
    
    const updatedUser = bddUpdate.rows && bddUpdate.rows[0]
    log.d('::confirm-profil-infos - Done, renvois du user mis à jour', updatedUser)
    req.session.user = updatedUser
    req.accessToken = updatedUser.uti_tockenfranceconnect;
    req.session.accessToken = updatedUser.uti_tockenfranceconnect;
    return res.send(formatUtilisateur(updatedUser))
})

router.post('/create-account-pwd', async (req, res) => {
    log.i('::create-account-pwd - In')
    const { password , mail, confirm } = req.body
    if(!password || !mail || !confirm) {
        throw new Error("Un paramètre manque pour effectuer l'inscription.")
    }
    const formatedMail = mail.toLowerCase()
    const crypted = await crypto.createHash('md5').update(password).digest('hex')
    let bddRes
    let confirmInscription
    // Vérifier si l'email est déjà utilisé en base.
    const mailExistenceQuery = await pgPool.query(`SELECT uti_id, uti_mail, uti_tockenfranceconnect FROM utilisateur WHERE uti_mail='${formatedMail}'`).catch(err => {
        log.w(err)
        throw err
    })

    if(mailExistenceQuery && mailExistenceQuery.rowCount > 0) {
        if(mailExistenceQuery.rows[0].uti_tockenfranceconnect && !mailExistenceQuery.rows[0].pwd) {
            log.d('::create-account-pwd - Utilisateur déjà connecté via FC.')
            confirmInscription = false
            bddRes = await pgPool.query(`UPDATE utilisateur SET uti_pwd= $1 WHERE uti_id= $2 RETURNING *`, [ crypted, mailExistenceQuery.rows[0].uti_id]
                ).catch(err => {
                    log.w(err)
                    throw err
                })
            await sendValidationMail({
                email: mailExistenceQuery.rows[0].uti_mail,
                pwd: crypted,
                id: mailExistenceQuery.rows[0].uti_id,
                siteName: 'Savoir Rouler à Vélo',
                url: `${config.FRONT_DOMAIN}`,
            })
            .then(() => log.d('Mail de confirmation envoyé'))
            .catch(err => {
                log.w(err)
                throw err
            })
        } else {
            return res.status(400).json({message: 'Veuillez contacter l\'assistance.'});        
        }
    } else {
        log.d('::create-account-pwd - Nouveau user, authentifié via password, à ajouter en base')
        confirmInscription = true    
        bddRes = await pgPool.query(
            'INSERT INTO utilisateur(pro_id, stu_id, uti_mail, validated, uti_pwd,uti_date_creation)\
            VALUES($1, $2, $3, $4, $5,now()) RETURNING *'
            , [3, 1, formatedMail, false, crypted ]
            /*
          ).then((result)=> {
            log.d(result.rows[0])
            const params = {
                tra_uti_id: result.rows[0].uti_id,
                tra_action : 'C',
                tta_id: 4,
                tra_objet: 'UTILISATEUR',
                tra_objet_id: result.rows[0].uti_id,
                tra_contenu: result.rows[0]
                }
        
            Promise.all(postTrace(params))
            }
            */
          ).catch(err => {
            log.w(err)
            throw err
          })
    }

    req.session.user = bddRes.rows[0]
    req.accessToken = bddRes.rows[0].uti_pwd;
    req.session.accessToken = bddRes.rows[0].uti_pwd;
    const user = formatUtilisateur(bddRes.rows[0])
    log.i('::create-account-pwd - Done')
    return res.send({ user, confirmInscription })
})

// Envoie l'utilisateur de la session
router.get('/user', (req,res) => {
    if(!req.session || !req.session.user || !req.session.accessToken){
        return res.sendStatus(404)
    }
    return res.send(formatUtilisateur(req.session.user))
})

router.put('/edit-mon-compte/:id', async function (req, res) {
    const user = req.body.profil
    const id = req.params.id
    log.i('::edit-mon-compte - In', { id })
    if(!id) {
        return res.status(400).json('Aucun ID fournit pour  identifier l\'utilisateur.');
    }
    //insert dans la table intervention
    const requete = `UPDATE utilisateur 
        SET uti_mail = lower($1),
        uti_nom = $2, 
        uti_prenom = $3, 
        uti_siteweb = $4,
        uti_adresse = $5,
        uti_complementadresse = $6,
        uti_com_codeinsee = $7,
        uti_com_codepostal = $8,
        uti_mailcontact = $9,
        uti_telephone = $10,
        uti_autorisepublicarte = $11
        WHERE uti_id = ${id}
        RETURNING *
        ;`    
    pgPool.query(requete,
        [user.mail,
        user.nom,  
        user.prenom, 
        user.siteweb,
        user.adresse,
        user.compladresse,
        user.codeinsee,
        user.codepostal,
        user.mailcontact,
        user.telephone,
        Boolean(user.autorisepublicarte)
        ], (err, result) => {
        if (err) {
            log.w('::edit-mon-compte - erreur lors de l\'update', {requete, erreur: err.stack});
            return res.status(400).json('erreur lors de la sauvegarde de l\'utilisateur');
        }
        else {
            log.i('::edit-mon-compte - Done')
            req.session.user = result.rows[0]
            return res.status(200).json({ user: formatUtilisateur(result.rows[0])});
        }
    })
})

// Validation du mot de passe.
router.get('/enable-mail/:pwd/user/:id', async function(req, res) {
    const id = req.params.id
    const pwd = req.params.pwd
    
    log.i('::enable-mail - In', { id })
    if(!id) {
        return res.status(400).json('Aucun ID fournit pour  identifier l\'utilisateur.');
    }

    const userQuery = await pgPool.query(`SELECT * FROM utilisateur WHERE uti_id='${id}'`).catch(err => {
        log.w(err)
        throw err
    })
    const user= userQuery.rowCount === 1 && userQuery.rows[0]

    if(!user) {
        return res.status(404).json({message: "L'utilisateur n'existe pas."});        
    }

    log.d('::enable-mail - user found', { user })
    if(user.uti_pwd === pwd && !user.pwd_validated) {
        const requete = `UPDATE utilisateur 
            SET pwd_validated = $1
            WHERE uti_id = $2
            RETURNING *
            ;`    
        pgPool.query(requete,[true, id], (err, result) => {
            if (err) {
                log.w('::enable-mail - erreur lors de l\'update', {requete, erreur: err.stack});
                return res.status(400).json('erreur lors de la sauvegarde de l\'utilisateur');
            }
            else {
                log.i('::enable-mail - Done, pwd has been validated.')
                req.session.user = result.rows[0]
                req.accessToken = result.rows[0].uti_pwd;
                req.session.accessToken = result.rows[0].uti_pwd;
                return res.status(200).json({ user: formatUtilisateur(result.rows[0])});
            }
        })
    } else {
        log.w('::enable-mail - erreur concernant le user à valider.')
        return res.status(400).json('L\'utilisateur a déjà validé son mot de passe ou le mot de passe fournit est incorrecte.');
    }    
})

// Reset du mot de passe oublié.
router.post('/forgot-password/:mail', async function(req, res) {
    const { mail } = req.params
    log.i('::forgot-password - In', { mail })

    if (!mail) {
        log.w('::forgot-password - mail absent de la requête.')
        return res.status(400).json({ message: 'Une adresse mail valide est nécessaire pour renouveler votre mot de passe.' })
    }
    await generateForgotPasswordEncryption({ mail })
        .then(encryption => {
            log.i('::forgot-password - Done', encryption)
            return sendResetPasswordMail(encryption)
                .then(() => {
                    return res.status(200).json('ok')
                })
        }).catch(error => {
            log.w('::forgot-password - erreur', error)
            return res.status(400).json({message: error.message});        
        })
})

router.post('/reset-password', async function(req, res) {
    const { id, old, password } = req.body
    log.i('::reset-password - In', { id, old, password })

    if(!id || !old || !password) {
        log.w('::reset-password - paramètre manquant.')
        return res.status(400).json({ message: 'Un paramètre manque à la requête.' })
    }

    const userQuery = await pgPool.query(`SELECT uti_id, uti_pwd FROM utilisateur WHERE uti_pwd='${old}'`).catch(err => {
        log.w(err)
        throw err
    })
    const user = userQuery.rows && userQuery.rows.find( user => {
        const candidate = user.uti_id && crypto.createHash('md5').update(user.uti_id.toString()).digest('hex')
        return candidate === id
    })
    if(!user) {
        log.w('::reset-password - Utilisateur inexistant.')
        return res.status(404).json({ message: 'Aucun utilisateur trouvé.' })
    }

    log.d('::reset-password - Mise à jour du user.')
    const newPwd= await crypto.createHash('md5').update(password).digest('hex')
    const updateRequete = `UPDATE utilisateur SET uti_pwd=$1, pwd_validated = true WHERE uti_id=$2;`    
    return pgPool.query(updateRequete,[ newPwd, user.uti_id],(err) => {
        if (err) {
            log.w('::reset-password - erreur lors de l\'update', {erreur: err.stack});
            return res.status(400).json('erreur lors de la sauvegarde du nouveau mot de passe.');
        }
        else {
            log.i('::reset-password - Done, nouveau mot de passe enregistré.')
            return res.status(200).json('ok');
        }
    })
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