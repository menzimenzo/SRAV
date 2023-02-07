const express = require('express');
const router = express.Router();
const stringify = require('csv-stringify')
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
const {postTrace} = require('../controllers');
moment().format();

const logger = require('../utils/logger')
const log = logger(module.filename)

const formatUser = user => {

    return {
        idformate: user.idformate,
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
        typeCollectivite: user.typeCollectivite,
        proLibelle:user.pro_libelle,
        inscription: user.inscription,
        siteweb: user.uti_siteweb, 
        adresse: user.uti_adresse,
        compladresse: user.uti_complementadresse,
        codeinsee: user.uti_com_codeinsee,
        codepostal: user.uti_com_codepostal,
        mailcontact: user.uti_mailcontact,
        telephone: user.uti_telephone,
        autorisepublicarte: user.uti_autorisepublicarte,
        formgenevelo: user.uti_form_gene_velo,
        ustid: user.ust_id,
        tcoid: user.tco_id,
        dcoid: user.dco_id,
        dcocodepostal: user.dco_codepostal,
        dcoinsee: user.dco_insee,
        dcoepcicode: user.dco_epci_code,
        dcodep: user.dco_dep,
        susid: user.sus_id
    }
}


const formatUserCSV = user => {

    return {
        id: user.uti_id,
        profil: user.pro_id,
        structure: user.str_id,
        statut: user.stu_id,
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
        autorisepublicarte: user.uti_autorisepublicarte,
        formgenevelo: user.uti_form_gene_velo
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
        str.str_libellecourt As Structure, ust.uti_structurelocale As Structure_Locale, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        replace(replace(uti_form_gene_velo::text,'true','Oui'),'false','Non') as formgenevelo,
        TO_CHAR(uti_date_creation, 'DD/MM/YYYY') as datecreationcompte,
        TO_CHAR(uti_date_connexion, 'DD/MM/YYYY') as datederniereconnexion
        from utilisateur  uti
        join uti_str ust on ust.uti_id = uti.uti_id
        join structure str on str.str_id= ust.str_id 
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id 
        join statut_utilisateur  stu on stu.stu_id = uti.stu_id
        order by 3,4 asc`;
    } 
    // Je suis utilisateur "Partenaire" ==> Export de la liste des interventants
    else {
        requete =`SELECT uti.uti_id As Identifiant , uti.uti_prenom as Prénom, uti_nom As Nom,  pro_libelle as Profil, uti_mail as Courriel,  
        replace(replace(validated::text,'true','Validée'),'false','Non validée') as inscription , stu.stu_libelle Statut_Utilisateur,
        str.str_libellecourt As Structure, ust.uti_structurelocale As Struture_Locale, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        uti_form_gene_velo as formgenevelo,
        dco.tco_id str_typeCollectivite
        from utilisateur  uti
        join uti_str ust on ust.uti_id = uti.uti_id
        join uti_str ustpar on ustpar.str_id = ust.str_id and ustpar.uti_id = ${utilisateurCourant.uti_id}
        left join detail_collectivite dco on dco.dco_id = ust.dco_id
        join structure str on str.str_id= ust.str_id 
        join profil pro on pro.pro_id = uti.pro_id and pro.pro_id <> 1
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join statut_utilisateur  stu on stu.stu_id = uti.stu_id
        order by 3,4 asc`;
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
                quote: '"',
                quoted: true,
                header: true,
                delimiter: ';'
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

router.get('/:ustid', async function (req, res) {
    //const id = req.params.id;
    const ustid = req.params.ustid;
    //log.i('::get - In', { id })
    log.i('::get - In', { ustid })
    const utilisateurCourant = req.session.user
    if ( utilisateurCourant.pro_id && utilisateurCourant.pro_id == 1) {
        // si on est admin, on affiche l'utilisateur
        requete = `SELECT uti.*,ust.*,dco.*,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription, str.str_libellecourt,pro.pro_libelle, uti.uti_siteweb as siteweb , 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        uti_form_gene_velo as formgenevelo,
        dco.tco_id str_typeCollectivite,
        ust.uti_structurelocale structurelocale
        from utilisateur uti 
        join uti_str ust on ust.uti_id = uti.uti_id and ust.ust_id=${ustid}
        left join detail_collectivite dco on dco.dco_id = ust.dco_id
        join structure str on str.str_id= ust.str_id 
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id
        order by uti.uti_id asc`;
    }
    else 
    {
        // si on est partenaire, on affiche l'utilisateur s'il appartient à ma structure
        requete = `SELECT uti.*,ust.*,dco.*,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription, str.str_libellecourt,pro.pro_libelle, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        uti_form_gene_velo as formgenevelo,
        dco.tco_id str_typeCollectivite,
        ust.uti_structurelocale structurelocale
        from utilisateur uti 
        join uti_str ust on ust.uti_id = uti.uti_id and ust.ust_id=${ustid}
        join uti_str ustpar on ust.str_id = ustpar.str_id and ustpar.ust_id=${utilisateurCourant.uti_id}
        left join detail_collectivite dco on dco.dco_id = ust.dco_id
        join structure str on str.str_id= ust.str_id 
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id
        order by uti.uti_id asc `;
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
            log.d({user})
            log.d('::get - Done')
            res.json({ user: formatUser(user) });
        }
    })
});

router.get('/', async function (req, res) {
    log.i('::list - In')
    const utilisateurCourant = req.session.user
    //const utilisateurId = 1; // TODO à récupérer via GET ?

    if ( utilisateurCourant.pro_id && (utilisateurCourant.pro_id == 1 ||  utilisateurCourant.pro_id == 4)) {
        // si on est admin, on affiche tous les utilisateurs
        requete = `SELECT to_char(uti.uti_id,'00000') as idformate, uti.*,ust.*, dco.* ,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription,str.str_libellecourt,pro.pro_libelle, 
        uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        uti_form_gene_velo as formgenevelo,
        dco.tco_id str_typeCollectivite,
        ust.uti_structurelocale as structurelocale
        from utilisateur uti 
        left join uti_str ust on ust.uti_id = uti.uti_id
        left join detail_collectivite dco on dco.dco_id = ust.dco_id
        left join structure str on str.str_id = ust.str_id `;

        if (utilisateurCourant.pro_id == 4) {
            requete += ` and str.str_id<> 9 `;
        }
        requete += `left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id
        order by uti.uti_id asc`;
    }
    else 
    {
        // si on est partenaire, on affiche seulements les utilisateurs de la structure
        // Sauf les Admin créés sur structure
        requete = `SELECT to_char(uti.uti_id,'00000') as idformate,uti.*,ust.*,replace(replace(uti.validated::text,'true','Validée'),'false','Non validée') as inscription,str.str_libellecourt,pro.pro_libelle, uti.uti_siteweb as siteweb, 
        uti.uti_adresse as adresse,
        uti_complementadresse as compladresse,
        uti_com_codeinsee as codeinsee,
        uti_com_codepostal as codepostal,
        com_libelle as commune,
        uti_mailcontact as mailcontact,
        uti_telephone as telephone,
        uti_autorisepublicarte as autorisepublicarte,
        uti_form_gene_velo as formgenevelo,
        dco.tco_id str_typeCollectivite
        from utilisateur uti 
        join uti_str ust on ust.uti_id = uti.uti_id
        left join detail_collectivite dco on dco.dco_id = ust.dco_id
        join structure str on str.str_id = ust.str_id 
        join uti_str strpart on strpart.str_id = str.str_id and strpart.uti_id = ${utilisateurCourant.uti_id}
        left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
        join profil pro on pro.pro_id = uti.pro_id and pro.pro_id <> 1
        order by uti.uti_id asc  `;
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
    let { nom, prenom, mail, profil, validated,structure, structureLocale, statut, siteweb, adresse, compladresse, codeinsee, codepostal, mailcontact, telephone, autorisepublicarte, ustid ,dcoid, dcocodepostal,dcoinsee,dcoepcicode,dcodep,susid,formgenevelo} = user

    if (ustid) {
        const requeteUst = `UPDATE uti_str
            SET uti_structurelocale = $1,
            sus_id = $2
            where ust_id = ${ustid}`
            pgPool.query(requeteUst,[structureLocale,susid], (err, result) => {
                if (err) {
                    log.w('::update uti_str - erreur lors de l\'update', {requete, erreur: err.stack});
                    return res.status(400).json('erreur lors de la sauvegarde de la structure locale');
                }
                else {
                    log.i('::update uti_str- Done')
                    //return res.status(200).json({ uti_str: result.rows[0]});
                }
            })
    }

    if (dcoid) {
        const requeteDco = `UPDATE detail_collectivite
            SET dco_codepostal = $2,
            dco_insee = $3,
            dco_epci_code = $4,
            dco_dep = $5
            where dco_id = $1`
            pgPool.query(requeteDco,[dcoid, dcocodepostal,dcoinsee,dcoepcicode,dcodep], (err, result) => {
                if (err) {
                    log.w('::update detail_collectivite - erreur lors de l\'update', {requete, erreur: err.stack});
                    return res.status(400).json('erreur lors de la sauvegarde de detail_collectivite');
                }
                else {
                    log.i('::update detail_collectivite- Done')
                    //return res.status(200).json({ uti_str: result.rows[0]});
                }
            })
    }


    const requete = `UPDATE utilisateur 
        SET uti_nom = $1,
        uti_prenom = $2,
        uti_mail = lower($3),
        validated = $4,
        pro_id = $5,
        stu_id = $6,
        uti_siteweb = $7,
        uti_adresse = $8,
        uti_complementadresse = $9,
        uti_com_codeinsee = $10,
        uti_com_codepostal = $11,
        uti_mailcontact = $12,
        uti_telephone = $13,
        uti_autorisepublicarte = $14,
        uti_form_gene_velo = $15
        WHERE uti_id = ${id}
        RETURNING *
        ;`    
        pgPool.query(requete,[nom,
            prenom,
            mail,
            validated,        
            profil,
            statut,
            siteweb,
            adresse,
            compladresse,
            codeinsee,
            codepostal,
            mailcontact,
            telephone,
            Boolean(autorisepublicarte),
            Boolean(formgenevelo)], (err, result) => {
        if (err) {
            log.w('::update - erreur lors de l\'update', {requete, erreur: err.stack});
            return res.status(400).json('erreur lors de la sauvegarde de l\'utilisateur');
        }
        else {
            log.i('::update - Done')
            /*
            const params = {
                tra_action : 'C',
                tta_type_id: 1,
                tra_objet: 'UTILISATEUR',
                tra_objet_id: user.id,
                tra_contenu: user
                }
            postTrace(params)
            */
            return res.status(200).json({ user: formatUser(result.rows[0])});
        }
    })
})

module.exports = router;