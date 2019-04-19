const express = require('express');
const router = express.Router();
const stringify = require('csv-stringify')
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


const formatUserCSV = user => {

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

/* route d'extraction de la liste d'utilisateurs pour le CSV */
/* Pas d'argument, on utilise la structure de l'utilisateur en session */
router.get('/csv', async function (req, res) {

    const utilisateurCourant = req.session.user;
    var requete = "";

    console.log("Profil de l'utilisateur : " + req.session.user.pro_id);
    // Je suis utilisateur "Administrateur" ==> Export de la liste des tous les utilisateurs
    if ( utilisateurCourant.pro_id == 1 ) {
        requete =`SELECT  uti.uti_id As Identifiant , uti.uti_prenom as Prénom, uti_nom As Nom,  pro_libelle as Profil, uti_mail as Courriel, to_char(uti_datenaissance,'DD/MM/YYYY') Date_De_Naissance, 
        replace(replace(validated::text,'true','Validée'),'false','Non validée') Inscription , stu.stu_libelle Statut_Utilisateur,
        str.str_libellecourt As Structure, uti.uti_structurelocale As Struture_Locale
        from utilisateur  uti
        join structure str on str.str_id= uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id 
        join statut_utilisateur  stu on stu.stu_id = uti.stu_id
        order by 3,4 asc`;
    } 
    // Je suis utilisateur "Partenaire" ==> Export de la liste des interventants
    else {
        requete =`SELECT uti.uti_id As Identifiant , uti.uti_prenom as Prénom, uti_nom As Nom,  pro_libelle as Profil, uti_mail as Courriel, to_char(uti_datenaissance,'DD/MM/YYYY') Date_De_Naissance, 
        replace(replace(validated::text,'true','Validée'),'false','Non validée') Inscription , stu.stu_libelle Statut_Utilisateur,
        str.str_libellecourt As Structure, uti.uti_structurelocale As Struture_Locale
        from utilisateur  uti
        join structure str on str.str_id= uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id and pro.pro_id <> 1
        join statut_utilisateur  stu on stu.stu_id = uti.stu_id
        where uti.str_id=${utilisateurCourant.str_id} order by 3,4 asc`;
    }
    console.log( requete);

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération des utilisateurs');
        }
        else {
            //console.info(result.rows)
            const users = result.rows;//.map(formatUser);
            if (!users || !users.length) {
                return res.status(400).json({ message: 'Utilisateurs inexistants' });
            }
            stringify(users, {
                quoted: '"',
                header: true
            }, (err, csvContent) => {
                if(err){
                    console.log(err)
                    return res.status(500)
                } else {

                    return res.send(csvContent)
                }
            })            
            //res.json({ users });
        }
    })
});

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
        // Sauf les Admin créés sur structure
        requete = `SELECT uti.*,str.str_libellecourt,pro.pro_libelle
        from utilisateur uti 
        join structure str on str.str_id = uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id and pro.pro_id <> 1
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
    let { nom, prenom, mail, profil, validated,structure, structureLocale, statut } = user

    //insert dans la table intervention
    const requete = `UPDATE utilisateur 
        SET uti_nom = $1,
        uti_prenom = $2,
        uti_mail = $3,
        validated = $4,
        pro_id = $5,
        str_id = $6,
        uti_structurelocale = $7,
        stu_id = $8
        WHERE uti_id = ${id}
        RETURNING *
        ;`    
    console.log(requete)
    pgPool.query(requete,[nom,
        prenom,
        mail,
        validated,
        profil,
        structure,
        structureLocale,
        statut], (err, result) => {
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