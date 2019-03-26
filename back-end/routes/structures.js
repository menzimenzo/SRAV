const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();



router.get('/structure', 
    async function (req, res) {
        const id = req.query.id;
        console.log('Recherche d\'une structure - id = ' + id);
    
        const requete =`SELECT * from Structure where str_id=${id}`;
        console.log(requete)
    
        pgPool.query(requete, (err, result) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).json('erreur lors de la récupération de la structure');
            }
            else {
                const structures = result.rows[0];
                if (!structures) {
                    return res.status(400).json({ message: 'Structure inexistante' });
                }
                return res.status(200).json({ structures });
            }
        })
    });
    
router.get('/',

    function (req, res) {

        console.log('Getting structures');
        // La méthode get est appelée sans paramètre : On retourne la liste
        pgPool.query(
            'SELECT * FROM structure order by str_libellecourt',
            function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Fin de la transaction structures (sans paramètres)', result.length);
                    return res.send(result.rows);
                }
            });

        
    });


module.exports = router;