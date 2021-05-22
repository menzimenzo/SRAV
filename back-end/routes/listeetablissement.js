const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

/*
Test : 
    Sur serveur web backend : 
        http://localhost:3001/listeetablissement?codepostal=57530
    Via l'exposition du backend par le proxy (nginx)  
        http://localhost/backend/listeetablissement?codepostal=57530

        localhost/backend/api/listeetablissement?codeuai=57530
*/

// Renvoie une liste d'établissement en fonction du code postal ou du numéro d'UAI
router.get('/',
    function (req, res) {

        // Cas du code postal
        if (req.query.codepostal) {
            var v_codepostal;
            v_codepostal = req.query.codepostal;
            console.log("Recherche etablissement par code postal" + v_codepostal)
            // Recherche des etablissements correspondants au codepostal
            pgPool.query(`select *, 
                        '[' || etablissement.eta_commune || '] ' ||  etablissement.eta_nom || ' [' ||  etablissement.eta_adresse1 || ']' as eta_affichage 
                        from etablissement 
                        where eta_codepostal = $1
                        order by eta_commune,eta_nom `,
                [$1 = v_codepostal],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const etablissement = result.rows;
                        return res.status(200).json({ etablissement });
                    }
                });
    
        }
        else
        // Cas du code UAI
        {
            var v_codeuai;
            v_codeuai = req.query.codeuai;
            // Recherche des etablissements correspondants au codepostal
            pgPool.query(`select *, 
                        '[' || etablissement.eta_commune || '] ' ||  etablissement.eta_nom || ' [' ||  etablissement.eta_adresse1 || ']' as eta_affichage 
                        from etablissement 
                        where eta_uai = $1
                        order by eta_commune,eta_nom `,
                [$1 = v_codeuai],
                (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        const etablissement = result.rows;
                        return res.status(200).json({ etablissement });
                    }
                });
    
        }
    });

module.exports = router;