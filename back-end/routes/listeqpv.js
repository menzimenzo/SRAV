const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

/*
Test : 
    Via l'exposition du backend par le proxy (nginx)  
        http://localhost/backend/api/listeqpv?codepostal=57530
*/

router.get('/',

    function (req, res) {
        var v_codepostal;
        v_codepostal = req.query.codepostal;
        // Recherche des qpv correspondant au codepostal
        pgPool.query(`select qpv.*
                        from qpv
                        inner join qpv_insee  qpi on qpi.qpv_code = qpv.qpv_code
                        inner join codepostal_insee  cpi on cpi.cpi_codeinsee = qpi.qpv_insee 
                    where cpi.cpi_codepostal = $1`,
            [$1 = v_codepostal],
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.statusCode(400).json({ message: 'erreur sur la requete de listqpv' });
                }
                else {
                    const qpv = result.rows;
                    return res.status(200).json({ qpv });
                }
            });
    });

module.exports = router;