const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

/*
router.get('/:id', async function (req, res) {
        const id = req.params.id;
        console.log('Recherche d\'une structure - id = ' + id);

        const requete = `SELECT * from Structure where str_id=${id}`;
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
    });*/

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

    router.put('/:id', async function (req, res) {
        const structure = req.body.structureSelectionnee    
        const id = req.params.id
        let { str_libelle, str_libellecourt, str_actif,str_federation } = structure
        console.log('str_libelle', str_libelle)
    
        //insert dans la table intervention
        const requete = `UPDATE structure 
            SET str_libelle = $1,
            str_libellecourt = $2,
            str_actif = $3,
            str_federation = $4
            WHERE str_id = ${id}
            RETURNING *
            ;`    
        console.log(requete)
        pgPool.query(requete,[str_libelle,
            str_libellecourt,
            str_actif,
            str_federation], (err, result) => {
            if (err) {
                console.log(requete);
                console.log(err.stack);
                return res.status(400).json('erreur lors de la sauvegarde de la structure');
            }
            else {
                console.log(result.rows)
                return res.status(200).json({ structure: (result.rows[0])});
            }
        })
    })

    router.post('/', function (req, res) {
        const structure = req.body.structure
        //console.log(structure)
       let { str_libelle,  str_libellecourt, str_actif, str_federation } = structure

       if (str_actif == '') { str_actif = false } else { str_actif = true}
       if (str_federation == '') { str_federation = false } else { str_federation = true}

        //insert dans la table structure
        const requete = `insert into structure 
                        (str_libelle,  str_libellecourt, str_actif, str_federation) 
                        values($1,$2,$3,$4 ) RETURNING *`;
        
        //console.log({ requete });
        pgPool.query(requete, [str_libelle,  str_libellecourt, str_actif, str_federation],(err, result) => {
            if (err) {
                console.log(err.stack);
                return res.status(400).json('erreur lors de la création de la structure');
            }
            else {
                console.log({ result, rows: result.rows });
    return res.status(200).json({ structure: (result.rows[0]) });
            }
        })
    })
module.exports = router;