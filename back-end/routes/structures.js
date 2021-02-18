const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

const logger = require('../utils/logger')
const log = logger(module.filename)

router.get('/:id', async function (req, res) {
        const id = req.params.id;
        log.i('::get - In', { id })
        const requete = `SELECT * from Structure where str_id=${id}`;
        pgPool.query(requete, (err, result) => {
            if (err) {
                log.w('::get - Erreur lors de la requete', { id, requete, erreur: err.stack })
                return res.status(400).json('erreur lors de la récupération de la structure');
            }
            else {
                const structures = result.rows[0];
                if (!structures) {
                    log.w('::get - Structure inexistante')
                    return res.status(400).json({ message: 'Structure inexistante' });
                }
                log.i('::get - Done')
                return res.status(200).json({ structures });
            }
        })
    });

router.get('/',

    function (req, res) {
        log.i('::list - In')
        // La méthode get est appelée sans paramètre : On retourne la liste
        pgPool.query(
            `SELECT *, replace(replace(str_actif::text,'true','Oui'),'false','Non') as str_actif_on, replace(replace(str_federation::text,'true','Oui'),'false','Non') as str_federation_on FROM structure order by str_libellecourt`,
            function (err, result) {
                if (err) {
                    log.w('::list - Erreur lors de la requete', { requete, erreur: err.stack })
                } else {
                    log.i('::list - Fin de la transaction structures (sans paramètres)', result.length);
                    return res.send(result.rows);
                }
            });


    });

    router.put('/:id', async function (req, res) {
        const structure = req.body.structureSelectionnee    
        const id = req.params.id
        log.i('::update - In', { id })
        let { str_libelle, str_libellecourt, str_actif,str_federation } = structure
    
        //insert dans la table intervention
        const requete = `UPDATE structure 
            SET str_libelle = $1,
            str_libellecourt = $2,
            str_actif = $3,
            str_federation = $4
            WHERE str_id = ${id}
            RETURNING *
            ;`    
        pgPool.query(requete,[str_libelle,
            str_libellecourt,
            str_actif,
            str_federation], (err, result) => {
            if (err) {
                log.w('::update - Erreur lors de la mise à jour', { requete , erreur: err.stack})
                return res.status(400).json('erreur lors de la sauvegarde de la structure');
            }
            else {
                log.i('::update - Done')
                return res.status(200).json({ structure: (result.rows[0])});
            }
        })
    })

    router.post('/', function (req, res) {
        log.i('::post - In')
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
                log.w('::update - Erreur lors de la création.', { requete , erreur: err.stack})                
                return res.status(400).json('erreur lors de la création de la structure');
            }
            else {
                log.i('::post - Done')
                return res.status(200).json({ structure: (result.rows[0]) });
            }
        })
    })
module.exports = router;