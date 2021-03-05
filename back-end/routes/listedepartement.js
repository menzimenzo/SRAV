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
        pgPool.query(`select dep_num, dep_libelle from departement`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.statusCode(400).json({ message: 'erreur sur la requete de listedepartement' });
                }
                else {
                    const departements = result.rows;
                    return res.status(200).json({ departements });
                }
            });
    });

module.exports = router;