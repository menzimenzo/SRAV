const express = require('express');
const router = express.Router();

const pgPool = require('../pgpool').getPool();
const config = require('../config');
const {sendEmail} = require('../utils/mail-service')
const {getAuthorizationUrl, getLogoutUrl, formatUtilisateur} = require('../utils/utils')
const bodyParser = require('body-parser');
var moment = require('moment');
var {
    oauthCallback
} = require('../controllers/oauthCallback')
moment().format();


router.get('/login', (req, res) => {
    return res.send({url: getAuthorizationUrl()});
});

// Gère une connexion validée avec FC
router.get('/callback', oauthCallback);

// Valide un compte utilisateur avec les infomations complémentaires
router.post('/verify', async (req,res) => {
    if(!req.body.id){
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
        // Mise à jour de l'utilisateur
        const updatResCollectivite = await pgPool.query("UPDATE utilisateur SET str_id = $1, uti_structurelocale = $4, uti_mail = $2, validated = true \
    WHERE uti_id = $3 RETURNING *",
            [idStructure, user.uti_mail, user.uti_id,user.libelleCollectivite]).catch(err => {
                console.log(err)
                throw err
            })
    }
    else {
        // Mise à jour de l'utilisateur
        const updatResHorsCollectivite = await pgPool.query("UPDATE utilisateur SET str_id = $1, uti_mail = $2, uti_structurelocale = $3, validated = true \
         WHERE uti_id = $4 RETURNING *",
            [user.str_id, user.uti_mail, user.uti_structurelocale, user.uti_id]).catch(err => {
                console.log(err)
                throw err
            })
    }
    const selectRes = await pgPool.query("SELECT uti.*, struct.str_typecollectivite, struct.str_libellecourt,struct.str_libelle from utilisateur uti \
    join structure struct on uti.Str_id = struct.str_id \
    WHERE uti_id = $1",
            [user.uti_id]).catch(err => {
                console.log(err)
                throw err
            })
    // Envoie de l'email de confirmation
    if(!wasValidated){
        sendEmail({
            to: user.uti_mail,
            subject: 'création compte savoir rouler à vélo',
            body: `<p>Bonjour,</p>
                <p>Votre compte « Intervenant Savoir Rouler à Vélo » a bien été créé. <br/><br/>
                Nous vous invitons à y renseigner les informations relatives à la mise en œuvre de chacun des 3 blocs du socle commun du SRAV.<br/>
                Le site <a href="www.savoirrouleravelo.fr">www.savoirrouleravelo.fr</a> est à votre disposition pour toute information sur le programme Savoir Rouler à Vélo.<br/></p>`
        })
    }
    req.session.user = selectRes.rows[0]
    user = formatUtilisateur(selectRes.rows[0])
    return res.send({user})
})

// Envoie l'utilisateur de la session
router.get('/user', (req,res) => {
    if(!req.session || !req.session.user || !req.session.accessToken){
        return res.sendStatus(404)
    }
    return res.send(formatUtilisateur(req.session.user))
})

// Envoie l'url FC pour se déconnecter
router.get('/logout', (req, res) => {
    res.send({url: getLogoutUrl(req)});
});

// Nettoie la session de l'utilisateur
router.get('/logged-out', (req, res) => {
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