const express = require('express');
const router = express.Router();
const stringify = require('csv-stringify')
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
moment().format();

const logger = require('../utils/logger')
const log = logger(module.filename)

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
        typeCollectivite: user.str_typeCollectivite,
        proLibelle:user.pro_libelle,
        inscription: user.inscription,
        siteweb: user.uti_siteweb, 
        adresse: user.uti_adresse,
        compladresse: user.uti_complementadresse,
        codeinsee: user.uti_com_codeinsee,
        codepostal: user.uti_com_codepostal,
        mailcontact: user.uti_mailcontact,
        telephone: user.uti_telephone,
        autorisepublicarte: user.uti_autorisepublicarte
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
        typeCollectivite: user.str_typeCollectivite,
        proLibelle:user.pro_libelle,
        inscription: user.inscription,
        siteweb: user.uti_siteweb, 
        adresse: user.uti_adresse,
        compladresse: user.uti_complementadresse,
        codeinsee: user.uti_com_codeinsee,
        codepostal: user.uti_com_codepostal,
        mailcontact: user.uti_mailcontact,
        telephone: user.uti_telephone,
        autorisepublicarte: user.uti_autorisepublicarte
    }
}

/* route d'extraction de la liste d'utilisateurs pour le CSV */
/* Pas d'argument, on utilise la structure de l'utilisateur en session */
router.get('/csv', async function (req, res) {
    log.i('::csv - In')
    const utilisateurCourant = req.session.user;
    var requete = "";

    log.d('::csv - Profil de l\'utilisateur : ' + req.session.user.pro_id);
    // Je suis utilisateur "Administrateur" ==> Export de la liste des tous les utilisateurs
    if ( utilisateurCourant.pro_id == 1 ) {
        requete =`SELECT  uti.uti_id As Identifiant , uti.uti_prenom as Prénom, uti_nom As Nom,  pro_libelle as Profil, uti_mail as Courriel,  
        replace(replace(validated::text,'true','Validée'),'false','Non validée') as inscription , stu.stu_libelle Statut_Utilisateur,
        str.str_libellecourt As Structure, uti.uti_structurelocale As Struture_Locale, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        str.str_typecollectivite typeCollectivite
        from utilisateur  uti
        join structure str on str.str_id= uti.str_id 
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id 
        join statut_utilisateur  stu on stu.stu_id = uti.stu_id
        order by 3,4 asc`;
    } 
    // Je suis utilisateur "Partenaire" ==> Export de la liste des interventants
    else {
        requete =`SELECT uti.uti_id As Identifiant , uti.uti_prenom as Prénom, uti_nom As Nom,  pro_libelle as Profil, uti_mail as Courriel,  
        replace(replace(validated::text,'true','Validée'),'false','Non validée') as inscription , stu.stu_libelle Statut_Utilisateur,
        str.str_libellecourt As Structure, uti.uti_structurelocale As Struture_Locale, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        str.str_typecollectivite typeCollectivite
        from utilisateur  uti
        join structure str on str.str_id= uti.str_id 
        join profil pro on pro.pro_id = uti.pro_id and pro.pro_id <> 1
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join statut_utilisateur  stu on stu.stu_id = uti.stu_id
        where uti.str_id=${utilisateurCourant.str_id} order by 3,4 asc`;
    }

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::csv - Erreur lors de la requête.', { requete, erreur: err.stack});
            return res.status(400).json('erreur lors de la récupération des utilisateurs');
        }
        else {
            const users = result.rows;//.map(formatUser);
            if (!users || !users.length) {
                log.w('::csv - Utilisateurs inexistants.')
                return res.status(400).json({ message: 'Utilisateurs inexistants' });
            }
            stringify(users, {
                quoted: '"',
                header: true
            }, (err, csvContent) => {
                if(err){
                    log.w('::csv - erreur',err)
                    return res.status(500)
                } else {
                    log.i('::csv - Done')
                    return res.send(csvContent)
                }
            })            
            //res.json({ users });
        }
    })
});

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    log.i('::get - In', { id })
    const utilisateurCourant = req.session.user
    if ( utilisateurCourant.pro_id == 1) {
        // si on est admin, on affiche l'utilisateur
        requete = `SELECT uti.*,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription, str.str_libellecourt,pro.pro_libelle, uti.uti_siteweb as siteweb , 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        str.str_typecollectivite typeCollectivite
        from utilisateur uti 
        join structure str on str.str_id= uti.str_id 
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id
        where uti_id=${id} order by uti_id asc`;
    }
    else 
    {
        // si on est partenaire, on affiche l'utilisateur s'il appartient à ma structure
        requete = `SELECT uti.*,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription, str.str_libellecourt,pro.pro_libelle, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        str.str_typecollectivite typeCollectivite
        from utilisateur uti 
        join structure str on str.str_id= uti.str_id 
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id
        where uti_id=${id} and uti.str_id = ${utilisateurCourant.str_id}
        order by uti_id asc `;
    }

    log.d('::get - select un USER'+requete)
    pgPool.query(requete, (err, result) => {
        if (err) { 
            log.w('::get - Erreur lors de la requête', err.stack)
            return res.status(400).json('erreur lors de la récupération de l\'utilisateur');
        }
        else {
            const user = result.rows && result.rows.length && result.rows[0];
            if (!user) {
                log.w('::get - Utilisateur inexistant')
                return res.status(400).json({ message: 'Utilisateur inexistant' });
            }
            log.d('::get - Done')
            res.json({ user: formatUser(user) });
        }
    })
});

router.get('/', async function (req, res) {
    log.i('::list - In')
    const utilisateurCourant = req.session.user
    //const utilisateurId = 1; // TODO à récupérer via GET ?
    
    if ( utilisateurCourant.pro_id == 1 ||  utilisateurCourant.pro_id == 4) {
        // si on est admin, on affiche tous les utilisateurs
        requete = `SELECT uti.*,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription,str.str_libellecourt,pro.pro_libelle, 
        uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        str.str_typecollectivite typeCollectivite
        from utilisateur uti 
        join structure str on str.str_id = uti.str_id `;

        if (utilisateurCourant.pro_id == 4) {
            requete += ` and str.str_id<> 9 `;
        }
        requete += `left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id
        order by uti_id asc`;
    }
    else 
    {
        // si on est partenaire, on affiche seulements les utilisateurs de la structure
        // Sauf les Admin créés sur structure
        requete = `SELECT uti.*,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription,str.str_libellecourt,pro.pro_libelle, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        str.str_typecollectivite typeCollectivite
        from utilisateur uti 
        join structure str on str.str_id = uti.str_id 
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id and pro.pro_id <> 1
        where uti.str_id=${utilisateurCourant.str_id} order by uti_id asc  `;
    }
    log.d('::list - requete',{ requete })
    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::list - erreur lors de la récupération.',err.stack);
            return res.status(400).json('erreur lors de la récupération des utilisateurs');
        }
        else {
            log.i('::list - Done')
            const users = result.rows.map(formatUser);
            res.json({ users });
        }
    })
});

router.put('/:id', async function (req, res) {
    const user = req.body.utilisateurSelectionne
    const id = req.params.id
    log.i('::update - In', { id })
    console.log(user)
    log.d('::update - ', { user })
    let { nom, prenom, mail, profil, validated,structure, structureLocale, statut, siteweb, adresse, compladresse, codeinsee, codepostal, mailcontact, telephone, autorisepublicarte } = user

    //insert dans la table intervention
    const requete = `UPDATE utilisateur 
        SET uti_nom = $1,
        uti_prenom = $2,
        uti_mail = lower($3),
        validated = $4,
        pro_id = $5,
        str_id = $6,
        uti_structurelocale = $7,
        stu_id = $8,
        uti_siteweb = $9,
        uti_adresse = $10,
        uti_complementadresse = $11,
        uti_com_codeinsee = $12,
        uti_com_codepostal = $13,
        uti_mailcontact = $14,
        uti_telephone = $15,
        uti_autorisepublicarte = $16
        WHERE uti_id = ${id}
        RETURNING *
        ;`    
        pgPool.query(requete,[nom,
            prenom,
            mail,
            validated,        
            profil,
            structure,
            structureLocale,
            statut,
            siteweb,
            adresse,
            compladresse,
            codeinsee,
            codepostal,
            mailcontact,
            telephone,
            Boolean(autorisepublicarte)], (err, result) => {
        if (err) {
            log.w('::update - erreur lors de l\'update', {requete, erreur: err.stack});
            return res.status(400).json('erreur lors de la sauvegarde de l\'utilisateur');
        }
        else {
            log.i('::update - Done')
            return res.status(200).json({ user: formatUser(result.rows[0])});
        }
    })
})

module.exports = router;