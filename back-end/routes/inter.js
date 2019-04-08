const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
moment().format();


router.get('/', async function (req, res) {

    if(!req.session.user){
        return res.sendStatus(403)
    }

    const user = req.session.user
    const utilisateurId = user.uti_id

  
    //const requete = `SELECT EXTRACT(month FROM int_dateintervention) AS mois, EXTRACT(month FROM int_dateintervention) AS annee, COUNT(*) FROM intervention GROUP BY annee, mois;`;
    const requete = `SELECT EXTRACT(month FROM int_dateintervention) AS mois FROM intervention GROUP BY mois;`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération des interventions');
        }
        else {
            //console.info(result.rows)
            const stat = result.rows;
            res.json({ stat });
        }
    })
});

module.exports = router;