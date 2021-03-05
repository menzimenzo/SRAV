const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

/*
Test : 
    Sur serveur web backend : 
        http://localhost:3001/listecommune?codepostal=57530
    Via l'exposition du backend par le proxy (nginx)  
        http://localhost/backend/listecommune?codepostal=57530
*/

router.get('/',

    function (req, res) {
        var v_codepostal;
        v_codepostal = req.query.codepostal;
        // Recherche des communes correspondant au codepostal
        pgPool.query(`select ep.epci_id,ep.epci_code, ep.epci_libelle from epci ep
                    join codepostal_insee cpi on cpi.cpi_codeinsee = ep.com_codeinsee
                    where cpi.cpi_codepostal = $1 limit 1`,
            [$1 = v_codepostal],
            (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    const epci = result.rows;
                    return res.status(200).json({ epci });
                }
            });
    });

module.exports = router;