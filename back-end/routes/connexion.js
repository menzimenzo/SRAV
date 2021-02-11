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
    if(!(req.body.id || req.body._id)){
        return res.sendStatus(500)
    }
    var wasValidated = req.body.validated
    var user = formatUtilisateur(req.body, false)

    if(!user.uti_authid && !user.uti_tockenfranceconnect) {
        throw new Error("L'utilisateur n'existe ni auprès du serveur d'authentification ni auprès de France Connect")
    }

    let bddRes
    if(req.body._id) {
        // Nouveau user, authentifié depuis authserver, à ajouter en base
        bddRes = await pgPool.query(
            'INSERT INTO utilisateur(pro_id, stu_id, str_id, uti_mail, uti_nom, uti_prenom, uti_datenaissance, validated, uti_structurelocale, uti_authid)\
            VALUES($1, $2, $3, $4, upper($5), $6, $7, $8, $9, $10) RETURNING *'
            , [3, 1, user.str_id, user.uti_mail, user.uti_nom, user.uti_prenom, user.uti_datenaissance, true, user.uti_structurelocale, user.uti_authid]
          ).catch(err => {
            console.log(err)
            throw err
          })
    } else {
        // Mise à jour de l'utilisateur existant
        bddRes = await pgPool.query("UPDATE utilisateur SET str_id = $1, uti_mail = $2, uti_structurelocale = $3, validated = true \
             WHERE uti_id = $4 RETURNING *", 
             [user.str_id, user.uti_mail, user.uti_structurelocale, user.uti_id]).catch(err => {
                 console.log(err)
                 throw err
             })
    }
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

    req.session.user = bddRes.rows[0]
    user = formatUtilisateur(bddRes.rows[0])
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