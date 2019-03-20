const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
moment().format();


const formatStructure = structure => {

    return {
        id: structure.str_id,
        lib: structure.str_libelle,
        libCourt: structure.str_libellecourt,
        federation: structure.str_actif
    }
}

router.get('/:id', async function (req, res) {

    const id = req.params.id;

    const requete =`SELECT * from structure where str_id=${id} order by str_id asc`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) { 
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération de la structure');
        }
        else {
            const structure = result.rows && result.rows.length && result.rows[0];
            if (!structure) {
                return res.status(400).json({ message: 'structure inexistante' });
            }
            res.json({ structure: formatUser(structure) });
        }
    })
});

router.get('/', async function (req, res) {

    const requete = `SELECT * from structure order by str_id asc`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération des structures');
        }
        else {
            console.info(result.rows)
            const structures = result.rows.map(formatStructure);
            res.json({ structures });
        }
    })
});
/*
router.put('/:id', async function (req, res) {
    const user = req.body.utilisateurSelectionne
    const id = req.params.id
    let { nom, prenom, mail, profil, validated } = user

    //insert dans la table intervention
    const requete = `UPDATE utilisateur 
        SET uti_nom = '${nom}',
        uti_prenom = '${prenom}',
        uti_mail = '${mail}',
        validated = ${validated},
        pro_id = ${profil}
        WHERE uti_id = ${id}
        ;`    
    
    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(requete);
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'utilisateur');
        }
        else {
            return res.status(200).json({ user: result.rows.map(formatUser)[0] });
        }
    })
})*/

module.exports = router;