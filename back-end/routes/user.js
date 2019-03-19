const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
moment().format();


const formatUser = user => {

    return {
        id: user.uti_id,
        profil: user.pro_id,
        structure: user.str_id,
        statut: user.stu_id,
        validated: user.validated,
        mail: user.uti_mail,
        nom: user.uti_nom,
        prenom: user.uti_prenom,
        naissance: user.uti_datenaissance,
        structureLocale: user.uti_structurelocale
    }
}

router.get('/:id', async function (req, res) {
    
    const id = req.params.id;

    const requete =`SELECT * from utilisateur where uti_id=${id} order by uti_id asc`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) { 
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'utilisateur');
        }
        else {
            const user = result.rows && result.rows.length && result.rows[0];
            if (!user) {
                return res.status(400).json({ message: 'Utilisateur inexistant' });
            }
            res.json({ user: formatUser(user) });
        }
    })
});

router.get('/', async function (req, res) {
    
    const utilisateurId = 1; // TODO à récupérer via GET ?
    const requete = `SELECT * from utilisateur order by uti_id asc`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération des utilisateurs');
        }
        else {
            console.info(result.rows)
            const users = result.rows.map(formatUser);
            res.json({ users });
        }
    })
});

router.put('/:id', async function (req, res) {
    const user = req.body.utilisateurSelectionne
    const id = req.params.id
    let { nom, prenom, mail, profil, validated,structure } = user

    //insert dans la table intervention
    const requete = `UPDATE utilisateur 
        SET uti_nom = '${nom}',
        uti_prenom = '${prenom}',
        uti_mail = '${mail}',
        validated = ${validated},
        pro_id = ${profil},
        str_id = ${structure}
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
})

module.exports = router;