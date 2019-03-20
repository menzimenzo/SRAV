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
    var user = formatUtilisateur(req.body, false)

    // Mise à jour de l'utilisateur
    const updatRes = await pgPool.query("UPDATE utilisateur SET str_id = $1, uti_mail = $2, uti_structurelocale = $3, validated = true \
         WHERE uti_id = $4 RETURNING *", 
         [user.str_id, user.uti_mail, user.uti_structurelocale, user.uti_id]).catch(err => {
             console.log(err)
             throw err
         })
    // Envoie de l'email de confirmation
    sendEmail({
        to: user.uti_mail,
        subject: 'Savoir rouler à vélo',
        body: `<p><b>Bonjour</b>,</p>
            <p>Nous vous confirmons votre inscription à la plateforme Savoir Rouler à Vélo<br/></p>`
    })
    req.session.user = updatRes.rows[0]
    user = formatUtilisateur(updatRes.rows[0])
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