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
        structureLocale: user.uti_structurelocale,
        structureLibelleCourt: user.str_libellecourt,
        proLibelle:user.pro_libelle
    }
}

router.get('/:id', async function (req, res) {
    
    const id = req.params.id;
    const utilisateurCourant = req.session.user
    if ( utilisateurCourant.pro_id == 1) {
        // si on est admin, on affiche l'utilisateur
        requete = `SELECT uti.*, str.str_libellecourt,pro.pro_libelle from utilisateur uti 
        join structure str on str.str_id= uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id
        where uti_id=${id} order by uti_id asc`;
    }
    else 
    {
        // si on est partenaire, on affiche l'utilisateur s'il appartient à ma structure
        requete = `SELECT uti.*, str.str_libellecourt,pro.pro_libelle from utilisateur uti 
        join structure str on str.str_id= uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id
        where uti_id=${id} and uti.str_id = ${utilisateurCourant.str_id}
        order by uti_id asc `;
    }

    console.log('select un USER'+requete)

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
    
    const utilisateurCourant = req.session.user
    //const utilisateurId = 1; // TODO à récupérer via GET ?
    
    if ( utilisateurCourant.pro_id == 1) {
        // si on est admin, on affiche tous les utilisateurs
        requete = `SELECT uti.*,str.str_libellecourt,pro.pro_libelle
        from utilisateur uti 
        join structure str on str.str_id = uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id
        order by uti_id asc`;
    }
    else 
    {
        // si on est partenaire, on affiche seulements les utilisateurs de la structure
        requete = `SELECT uti.*,str.str_libellecourt,pro.pro_libelle
        from utilisateur uti 
        join structure str on str.str_id = uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id
        where uti.str_id=${utilisateurCourant.str_id} order by uti_id asc  `;
    }
    console.log( requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération des utilisateurs');
        }
        else {
            //console.info(result.rows)
            const users = result.rows.map(formatUser);
            res.json({ users });
        }
    })
});

router.put('/:id', async function (req, res) {
    const user = req.body.utilisateurSelectionne
    const id = req.params.id
    let { nom, prenom, mail, profil, validated,structure, structureLocale } = user

    //insert dans la table intervention
    const requete = `UPDATE utilisateur 
        SET uti_nom = '${nom}',
        uti_prenom = '${prenom}',
        uti_mail = '${mail}',
        validated = ${validated},
        pro_id = ${profil},
        str_id = ${structure},
        uti_structurelocale = '${structureLocale}'
        WHERE uti_id = ${id}
        RETURNING *
        ;`    
    
    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(requete);
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'utilisateur');
        }
        else {
            console.log(result.rows)
            return res.status(200).json({ user: formatUser(result.rows[0])});
        }
    })
})

module.exports = router;