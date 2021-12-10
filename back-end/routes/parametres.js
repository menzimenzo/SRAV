const express = require('express');
const router = express.Router();

const logger = require('../utils/logger')
const log = logger(module.filename)

const pgPool = require('../pgpool').getPool();
const config     = require('../config');
var moment = require('moment');

// Route permettant de récupérer la valeur d'un paramètre dans la table paramètres
// exemple : http://localhost/backend/api/parametres?code=PROTO_APPLI
router.get('/:codeParametre',async (req, res) => {
    log.i('::parametres - In')

    //var startTime = new Date();
    var requete = "";
    const  parametre = req.params.codeParametre

    log.d('::parametres - du paramètre : ' + parametre);

    requete =`SELECT par_valeur 
        from parametres
        where par_code = '${parametre}'`;
    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::parametres - Erreur lors de la requête.', { requete, erreur: err.stack});
            //logTrace('aaq-csvods',1,startTime);
            return res.status(400).json('erreur lors de la récupération du parametre ' + parametre);
        }
        else {
            const resultat = result.rows;
            log.d(resultat)
            if (!resultat || !resultat.length) {
                log.w('::parametre - Résultat vide.')
                //logTrace('aaq-csvods',2,startTime);
                return res.status(400).json('Le paramètre demandé n\'existe pas : ' + parametre)
            }
            else
            {
                res.json({ parametre: resultat[0] });
               // return res.send(resultat[0]);
            }
        }
    })

    log.i('::parametre - Done')
});

router.get('/', function (req, res) {
    res.send('Ceci est la route des parametres');
});

module.exports = router;