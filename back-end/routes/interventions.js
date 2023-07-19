const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
const stringify                                        = require('csv-stringify')
const myPdf = require('../utils/pdf')
var moment = require('moment');
moment().format();
const {postTrace} = require('../controllers');

const logger = require('../utils/logger')
const log = logger(module.filename)

const formatIntervention = intervention => {

    var result = {
        id: intervention.int_id,
        cai: intervention.cai_id,
        blocId: intervention.blo_id,
        sinId: intervention.sin_id,
        utiId: intervention.uti_id,
        cp: intervention.int_com_codepostal,
        commune: {
            com_libellemaj: intervention.int_com_libelle,
            cpi_codeinsee: intervention.int_com_codeinsee,
            dep_num: intervention.int_dep_num,
            reg_num: intervention.int_reg_num
        },
        nbEnfants: intervention.int_nombreenfant,
        nbFilles: intervention.int_nombrefille,
        nbGarcons: intervention.int_nombregarcon,
        nbmoinssix:intervention.int_nombremoinssix,
        nbsixhuit:intervention.int_nombresixhuit,
        nbneufdix:intervention.int_nombreneufdix,
        nbplusdix:intervention.int_nombreplusdix,
        dateIntervention: new Date(intervention.int_dateintervention),
        dateCreation: new Date(intervention.int_datecreation),
        dateMaj: intervention.int_datemaj,
        commentaire: intervention.int_commentaire,
        siteintervention: intervention.int_siteintervention,
        departement:intervention.int_dep_num,
        departement_libelle:intervention.dep_libelle,
        region:intervention.reg_num,
        region_libelle:intervention.reg_libelle,        
        isenfantshandicapes: intervention.int_isenfantshandicapes,
        enfantshandicapes: intervention.enfantshandicapes,
        nbenfantshandicapes: intervention.int_nbenfantshandicapes,
        isqpv: intervention.int_isqpv,
        qpv:intervention.qpv,
        isciteseducatives: intervention.int_isciteseducatives,
        citeseducatives:intervention.citeseducatives,
        qpvcode: intervention.int_qpv_code,
        zrrstatut: intervention.zst_libelle,
        ustid: intervention.ust_id,
        tcoid: intervention.tco_id,
        tcocode: intervention.tco_code,
        strcorealisatrice: intervention.str_id_co_realise,
        strlibcorealisatrice: intervention.str_lib_co_realise,
        strcorealisatriceautre: intervention.int_corealiseautre,
        eveid: intervention.eve_id,
        structureId: intervention.str_id,
        intfinans:intervention.int_fin_ans,
        intfingenevelo:intervention.int_fin_gene_velo,
        intfinautre:intervention.int_fin_autre,
        intfinaucun:intervention.int_fin_aucun,
        inttypeans:intervention.int_type_ans,
        financement_ans:intervention.financement_ans,
        type_financement_ans:intervention.type_financement_ans,
        financement_generation_velo:intervention.financement_generation_velo,
        financement_autre:intervention.financement_autre,
        financement_aucun:intervention.financement_aucun
    }

    if(intervention.uti_nom){
        result.nom = intervention.uti_prenom + ' ' + intervention.uti_nom
    }

    if(intervention.blo_libelle){
        result.blocLib = intervention.blo_libelle
    }

    if(intervention.cai_libelle){
        result.caiLib = intervention.cai_libelle
    }
    result.structure = intervention.str_libellecourt
    result.structureCode = intervention.str_libellecourt;
    result.structureLibelle = intervention.str_libelle;
    result.structureId = intervention.str_id
    result.StructureLocaleUtilisateur = intervention.uti_structurelocale;

    return result
}
router.get('/delete/:id', async function (req, res) {
    const intervention = req.body.intervention;
    const id = req.params.id;
    log.i('::delete - In', { id })

    //insert dans la table intervention
    const requete = `DELETE FROM  intervention 
        WHERE int_id = $1
        RETURNING *
        ;`;
    
    pgPool.query(requete, [id], (err, result) => {
        if (err) {
            log.w('::delete - Erreur survenue lors de la suppression.', { requete, err: err.stack})
            return res.status(400).json('erreur lors de la suppression de l\'intervention ' + id);
        }
        else {
            log.i('::delete - Done')
            // Suppression effectuée avec succès
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });

        }
    })
})

router.get('/csv/filtre', async function (req, res) {

    const  utilisateurId = req.query.id
    const  idStructureUtilisateur = req.query.idStructureUtilisateur
    const  dateDebut = req.query.dateDebut
    const  dateFin = req.query.dateFin
    const  idStructure = req.query.idStructure

    var whereClause = ""
    // Modification de la récupération de l'utilisateur courant 
     if(!req.session.user){
         return res.sendStatus(403)
     }
     const id = req.params.id
     const user = req.session.user
     //const utilisateurId = user.uti_id
     //const stru = user.uti_id
     const stru = req.query.id
 
     log.i('::csv filtre - In', { utilisateurId, stru })
     if(user.pro_id == 4){
        // Toutes structures
        // Exclusion des EN et Sécurité routière
        whereClause += ` where structure.str_id not in (9,11)`
    }
    // Intervenant
    if(user.pro_id == 3){
        // Utilisateur est intervenant => ses interventions
        // Multistructure
        whereClause += `where ust.uti_id=${utilisateurId} `
    } 
    // Admin
    if(user.pro_id == 1){
        // Admin : Astuce pour avoir un where
        whereClause += `where 1 = 1 `
    } 
    // Filtres en provenant du front
    // Profil partenaire
    if(user.pro_id == 2){
        if(idStructure || idStructure != 'null')
        {
            // Toutes structures
            if(idStructure == 99)
            {
                if (user.str_id == 9)
                    // Exclusion structure 11
                    whereClause += ` where structure.str_id not in (11) `
                else if (user.str_id == 11)
                    // Exclusion structure 9
                    whereClause += ` where structure.str_id not in (9) `
                else
                    // Exclusion structure 9 et 11 
                    whereClause += ` where structure.str_id not in (9,11) `
            }
            else
                // Structure ciblée
                whereClause += ` where ust.str_id = ${idStructure} `
        }
    }
    // Filtre sur la structure locale pour l'intervenant
    if(user.pro_id == 3){
        if(idStructureUtilisateur || idStructureUtilisateur != 'null')
        {
            whereClause += ` and ust.ust_id = ${idStructureUtilisateur} `
        }
    }
    // Filtre sur date début
    if(dateDebut && dateDebut != 'null' && dateDebut != '')
    {
        whereClause += ` and int_dateintervention >= '${dateDebut}' `
    }
    // Filtre sur date fin
    if(dateFin && dateFin != 'null')
    {
        whereClause += ` and int_dateintervention <= '${dateFin}' `
    }
    // Remplacement Clause Where en remplacant utilisateur par clause dynamique
    const requete =`SELECT *,TO_CHAR(int_dateintervention, 'DD/MM/YYYY') AS dateint,TO_CHAR(int_datecreation, 'DD/MM/YYYY HH24:MI:SS') AS datec,
        TO_CHAR(int_datemaj, 'DD/MM/YYYY HH24:MI:SS') AS datem,co.str_libelle as str_lib_co_realise,int_corealiseautre as lib_co_realiseautre ,
        eve.eve_titre as evenement_associe, replace(replace(int_fin_ans::text,'true','Oui')::text, 'false','Non') as financement_ans , 
        replace(replace(replace(int_type_ans::text,'1','PST')::text, '2','PSF')::text, '3','CIV') as type_financement_ans, 
        replace(replace(int_fin_gene_velo::text,'true','Oui')::text, 'false','Non') as financement_generation_velo, 
        replace(replace(int_fin_autre::text,'true','Oui')::text, 'false','Non') as financement_autre,
        replace(replace(int_fin_aucun::text,'true','Oui')::text, 'false','Non') as financement_aucun, 
        dep.dep_libelle,
        reg.reg_libelle,
        replace(replace(int_isenfantshandicapes::text,'true','Oui')::text, 'false','Non') as enfantshandicapes, 
        replace(replace(int_isqpv::text,'true','Oui')::text, 'false','Non') as qpv, 
        replace(replace(int_isciteseducatives::text,'true','Oui')::text, 'false','Non') as citeseducatives
    from intervention 
    INNER JOIN bloc ON bloc.blo_id = intervention.blo_id 
    INNER JOIN cadreintervention ON cadreintervention.cai_id = intervention.cai_id 
    INNER JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id 
    LEFT JOIN qpv ON intervention.int_qpv_code = qpv.qpv_code
    LEFT JOIN zrr_insee zin on intervention.int_com_codeinsee = zin.zin_insee
    LEFT JOIN zrr_statut zst on zin.zst_id = zst.zst_id
    LEFT JOIN structure co on co.str_id = intervention.str_id_co_realise
    LEFT JOIN evenement eve on eve.eve_id = intervention.eve_id
    INNER JOIN uti_str ust ON intervention.ust_id = ust.ust_id
    INNER JOIN structure ON structure.str_id = ust.str_id 
    INNER JOIN departement dep ON dep.dep_num = int_dep_num
    INNER JOIN region reg ON reg.reg_num = int_reg_num
    ${whereClause} 
    order by int_id asc`;
    log.d('::csv - requet', { requete })

    const requeteP = `SELECT par_valeur 
            from parametres
            where par_code = 'CSV_FINANC'`
    await pgPool.query(requeteP, (err, result) => {
        if (err) {
            log.w('::csv - erreur lors de la requête.',err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'intervention');
        }
        else {
            /*
            0087034
            Suppression des colonnes 
            cai; sinId; dateMaj; structureId; dep_num; reg_num; structureCode; structureLibelle
            */
            var param = result.rows;
            log.d('::csv - param.',param);
            pgPool.query(requete, (err, result) => {
                if (err) {
                    log.w('::csv - erreur lors de la requête.',err.stack);
                    return res.status(400).json('erreur lors de la récupération de l\'intervention');
                }
                else {
                    /*
                    0087034
                    Suppression des colonnes 
                    cai; sinId; dateMaj; structureId; dep_num; reg_num; structureCode; structureLibelle
                    */
                    var interventions = result.rows;
                    interventions = interventions.map(intervention => {
        
                        var newIntervention = formatIntervention(intervention)
                        delete newIntervention.commune
                        delete newIntervention.cai;
                        delete newIntervention.eveid;
                        delete newIntervention.sinId;
                        delete newIntervention.structureId;
                        newIntervention.commune = intervention.int_com_libelle
                        newIntervention.codeinsee = intervention.int_com_codeinsee
                        //newIntervention.dep_num = intervention.int_dep_num
                        //newIntervention.reg_num = intervention.int_reg_num
                        // Correction LSC 
                        //newIntervention.dateIntervention = newIntervention.dateIntervention.toLocaleDateString(),
                        newIntervention.dateIntervention = intervention.dateint,
                        //newIntervention.dateCreation = newIntervention.dateCreation.toISOString(),
                        newIntervention.dateCreation = intervention.datec,
                        //newIntervention.dateMaj = newIntervention.dateMaj.toISOString()
                        newIntervention.dateMaj = intervention.datem
                        // Fin correction LSC
                        delete newIntervention.dateMaj;
                        delete newIntervention.structureCode;
                        delete newIntervention.structureLibelle;
                        delete newIntervention.StructureLocaleUtilisateur;

                        delete newIntervention.intfinans;
                        delete newIntervention.intfingenevelo;
                        delete newIntervention.intfinautre;
                        delete newIntervention.intfinaucun;
                        delete newIntervention.inttypeans;

                        delete newIntervention.isenfantshandicapes;
                        delete newIntervention.isqpv;
                        delete newIntervention.isciteseducatives;

                        //newIntervention.structureCode = intervention.str_libellecourt;
                        //newIntervention.structureLibelle = intervention.str_libelle;
                        newIntervention.StructureLocaleUtilisateur = intervention.uti_structurelocale;
                        newIntervention.qpvlib = intervention.qpv_libelle;
                        newIntervention.evenement_associe = intervention.evenement_associe;
                          
                        // On verifie les autorisation dans le paramètre CSV_FINANC
                        if (param[0].par_valeur.includes(user.pro_id)) {
                            log.d ("Utilisateur autorisé",user.pro_id)
                            newIntervention.financement_ans = intervention.financement_ans;
                            newIntervention.financement_generation_velo = intervention.financement_generation_velo;
                            newIntervention.financement_autre = intervention.financement_autre;
                            newIntervention.financement_aucun = intervention.financement_aucun;
                        }
                        else {
                            log.d ("Utilisateur non autorisé",user.pro_id)
                        }
       
                        // Pour un profil référent, on supprime le site d'intervention pour éviter les infos sur les écoles
                        if(user.pro_id == 4){
                            delete newIntervention.siteintervention;
                        }
                        delete newIntervention.commentaire                
                        log.d('::csv - return newIntervention.')
                        return newIntervention
                    })
                    if (!interventions || !interventions.length) {
                        log.w('::csv - Intervention inexistante.');
                        return res.status(400).json({ message: 'Interventions inexistante' });
                    }
                    stringify(interventions, {
                    quote: '"',
                    quoted: true,
                    header: true,
                    delimiter: ';'
                    }, (err, csvContent) => {
                        if(err){
                            log.w('::csv - Erreur lors callback après stringify.',err.stack);
                            return res.status(500)
                        } else {
                            log.i('::csv - Done')
                            /*
                            const params = {
                                tra_uti_id: req.session.user.uti_id,
                                tra_action : 'R',
                                tta_id: 53,
                                tra_objet: 'INTERVENTION',
                                tra_objet_id: 1,
                                tra_contenu: req.query
                                }

                            postTrace(params)
                            */
                            return res.send(csvContent)
                        }
                    })
                }
            })            
        }
    })



 });

// ################# Nombre d'attestation par structure #################
// Pour str_id = 0 on remonte toutes les données 
//
router.get('/nbattestations', async function (req, res) {
    log.i('::nbattestations - In')
    const user = req.session.user

    if(!req.query.str_id){ 
        log.w('::nbattestations - Paramètres str_id manquant.')
        return res.sendStatus(403) 
    }
    const structureId = req.query.str_id

    // Get subset of interventions depending on user profile
    var whereClause = ""

    if(structureId != 0){
        whereClause += ` and str.str_id = ${structureId} `
    }

    // Exclusion des structures éducation nationale pour le profil référent
    if (user.pro_id == 4){
        whereClause += ` and str.str_id <> 9 `
    }

    const requete = `SELECT COALESCE(sum(int_nombreenfant),0) as nbattestations 
                from intervention int 
                inner join utilisateur uti on uti.uti_id = int.uti_id
                inner join uti_str ust on ust.ust_id = int.ust_id
                inner join structure str on str.str_id = ust.str_id
                ${whereClause}
                where int.blo_id = 3`;

    log.d('::nbattestations - récuperation via la requête.',{ requete })

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::nbattestations - Erreur lors de la requête.', { requete, erreur: err.stack});
            //logTrace('aaq-csvods',1,startTime);
            return res.status(400).json('erreur lors de la récupération du parametre ' + structureId);
        }
        else {
            const resultat = result.rows;
            log.d(resultat)
            if (!resultat || !resultat.length) {
                log.w('::nbattestations - Résultat vide.')
                //logTrace('aaq-csvods',2,startTime);
                return res.send(resultat[0].nbAttestations);
            }
            else
            {
                log.i('::nbattestations - Done1')
                return res.send(resultat[0]);
            }
        }
    })

    log.i('::nbattestations - Done')
});


// ################# Nombre d'attestation par structure #################
// Pour str_id = 0 on remonte toutes les données 
//
router.get('/annees', async function (req, res) {
    log.i('::annees - In')
    const user = req.session.user

    const requete = `SELECT to_char(int_dateintervention,'YYYY') annees
                from intervention 
                group by annees
                order by annees`;

    log.d('::annees - récuperation via la requête.',{ requete })

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::annees - Erreur lors de la requête.', { requete, erreur: err.stack});
            //logTrace('aaq-csvods',1,startTime);
            return res.status(400).json('erreur lors de la récupération des années d\'intervention');
        }
        else {
            const resultat = result.rows;
            log.d("résultat : ",resultat)
            if (!resultat || !resultat.length) {
                log.w('::annees - Résultat vide.')
                return res.send(resultat);
            }
            else
            {
                log.i('::annees - Done1')
                return res.send(resultat);
            }
        }
    })

    log.i('::annees - Done')
});

router.get('/tdb/', async function (req, res) {
    // Modification de la récupération de l'utilisateur courant 
    if (!req.session.user) {
        return res.sendStatus(403)
    }
    const user = req.session.user
    var annee = req.query.annee
    var crtb1 = ""
    var crtb2 = "" 
    var crtb3 = ""
    var crtb = ""
    log.d("req.query.annee",req.query.annee)
    if (annee && annee != "toutes") {
        crtb = " and to_char(intb.int_dateintervention,'YYYY') = '" + annee + "'"
        crtb1 = " and to_char(intb1.int_dateintervention,'YYYY') = '" + annee + "'"
        crtb2 = " and to_char(intb2.int_dateintervention,'YYYY') = '" + annee + "'"
        crtb3 = " and to_char(intb3.int_dateintervention,'YYYY') = '" + annee + "'"
    }
    var typetdb = req.query.typetdb
    var csv = req.query.csv
    var requete = null
    log.d("req.query.typetdb",req.query.typetdb)
    //typetdb = "dep"
    log.i('::tdb - In - ',typetdb)
    log.i('::tdb - In -  typetdb === dep ',typetdb === "dep")
    log.i('::tdb - In -  typetdb == dep ',typetdb == "dep")
    
    if (typetdb === "dep") {
        log.i('::tdb - Dep ')
        requete = `select reg.reg_libelle as region, dep.dep_libelle as departement, dep.dep_num as codedepartement, 
        (select COALESCE(sum(intb1.int_nombreenfant),0) as nbenfantsbloc1 from intervention intb1 where intb1.int_dep_num = dep.dep_num and intb1.blo_id = 1 ${crtb1}), 
        (select COALESCE(sum(intb2.int_nombreenfant),0) as nbenfantsbloc2 from intervention intb2 where intb2.int_dep_num = dep.dep_num and intb2.blo_id = 2 ${crtb2}), 
        (select COALESCE(sum(intb3.int_nombreenfant),0) as nbenfantsbloc3 from intervention intb3 where intb3.int_dep_num = dep.dep_num and intb3.blo_id = 3 ${crtb3}),
        (select COALESCE(sum(intb.int_nombreenfant),0) as nbenfantstotal from intervention intb where intb.int_dep_num = dep.dep_num ${crtb})
        from region reg
        left join departement dep on reg.reg_num = dep.reg_num
        group by 1,2,3
        order by 1,2,3`;
    } else
    {
        log.i('::tdb - Reg')
        requete = `select reg.reg_libelle as region,reg.reg_num as coderegion,
		(select COALESCE(sum(intb1.int_nombreenfant),0) as nbenfantsbloc1 from intervention intb1 where intb1.int_reg_num = reg.reg_num and intb1.blo_id = 1 ${crtb1}), 
		(select COALESCE(sum(intb2.int_nombreenfant),0) as nbenfantsbloc2 from intervention intb2 where intb2.int_reg_num = reg.reg_num and intb2.blo_id = 2 ${crtb2}), 
		(select COALESCE(sum(intb3.int_nombreenfant),0) as nbenfantsbloc3 from intervention intb3 where intb3.int_reg_num = reg.reg_num and intb3.blo_id = 3 ${crtb3}),
		(select COALESCE(sum(intb.int_nombreenfant),0) as nbenfantstotal from intervention intb where intb.int_reg_num = reg.reg_num ${crtb})
        from region reg
        group by 1,2
        order by 1,2`;
    }


    log.i('::tdb - requête', { requete })    
    return pgPool.query(requete,(err, result) => {
        if (err) {
            log.w('::tdb - error', err)
            return res.status(400).json({ message: 'erreur sur la requete de recherche du tableau de bord' });
        }
        else {

            // Retour de la requête normale
            if (!csv) {
                log.i('::tdb - Done')    
                const tdb = result.rows;
                return res.status(200).json({ tdb });
            }
            else
            // Retour au format csv
            {
                stringify(result.rows, {
                    quote: '"',
                    quoted: true,
                    header: true,
                    delimiter: ';'
                }, (err, csvContent) => {
                    if(err){
                        log.w('::csv - Erreur lors callback après stringify.',err.stack);
                        return res.status(500)
                    } else {
                        log.i('::csv - Done')
                        return res.send(csvContent)
                    }
                })
            }
        }
    });

});

router.get('/liste', async function (req, res) {
    log.i('::get - liste filtree')
    
    const  idStructureUtilisateur = req.query.idStructureUtilisateur
    const  idStructure = req.query.idStructure
    const  dateDebut = req.query.dateDebut
    const  dateFin = req.query.dateFin

    if(!req.session.user){ 
        log.w('::list - User manquant.')
        return res.sendStatus(403) 
    }

    const user = req.session.user
    const utilisateurId = user.uti_id

    var whereClause = ""
    whereClause += `INNER JOIN uti_str ust ON ust.ust_id = intervention.ust_id 
        left join detail_collectivite dco on dco.dco_id = ust.dco_id
        left join type_collectivite tco on tco.tco_id = dco.tco_id
        INNER JOIN structure ON structure.str_id = ust.str_id `
    // Référent
    if(user.pro_id == 4){
        // Toutes structures
        // Exclusion des EN et Sécurité routière
        whereClause += ` where structure.str_id not in (9,11)`
    }
    // Intervenant
    if(user.pro_id == 3){
        // Utilisateur est intervenant => ses interventions
        // Multistructure
        whereClause += `where ust.uti_id=${utilisateurId} `
    } 
    // Admin
    if(user.pro_id == 1){
        // Admin : Astuce pour avoir un where
        whereClause += `where 1 = 1 `
    } 
    // Filtres en provenant du front
    // Profil partenaire
    if(user.pro_id == 2){
        if(idStructure || idStructure != 'null')
        {
            // Toutes structures
            if(idStructure == 99)
            {
                if (user.str_id == 9)
                    // Exclusion structure 11
                    whereClause += ` where structure.str_id not in (11) `
                else if (user.str_id == 11)
                    // Exclusion structure 9
                    whereClause += ` where structure.str_id not in (9) `
                else
                    // Exclusion structure 9 et 11 
                    whereClause += ` where structure.str_id not in (9,11) `
            }
            else
                // Structure ciblée
                whereClause += ` where ust.str_id = ${idStructure} `
        }
    }
    // Filtre sur la structure locale pour l'intervenant
    if(user.pro_id == 3){
        if(idStructureUtilisateur || idStructureUtilisateur != 'null')
        {
            whereClause += ` and ust.ust_id = ${idStructureUtilisateur} `
        }
    }
    // Filtre sur date début
    if(dateDebut && dateDebut != 'null' && dateDebut != '')
    {
        whereClause += ` and int_dateintervention >= '${dateDebut}' `
    }
    // Filtre sur date fin
    if(dateFin && dateFin != 'null')
    {
        whereClause += ` and int_dateintervention <= '${dateFin}' `
    }

    const requete = `SELECT * from intervention ${whereClause} order by int_dateintervention desc`;
    log.d('::list - récuperation via la requête.',{ requete })

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::list - Erreur survenue lors de la récupération.',err.stack);
            return res.status(400).json('erreur lors de la récupération des interventions');
        }
        else {
            log.i('::list - Done')
            const interventions = result.rows.map(formatIntervention);
            res.json({ interventions });
        }
    })
});

router.get('/:id', async function (req, res) {
    log.i('::get - In')
    if(!req.session.user){
        log.w('::get - User manquant.')
        return res.sendStatus(403)
    }
    const id = req.params.id
    const user = req.session.user
    const utilisateurId = user.uti_id

    // Where condition is here for security reasons.
    var whereClause = ""
    if(user.pro_id == 3){
        whereClause += ` and intervention.uti_id=${utilisateurId} `
    }

    const requete =`SELECT intervention.*, ust.str_id from intervention 
        INNER JOIN uti_str ust ON ust.ust_id = intervention.ust_id 
    where int_id=${id} ${whereClause} order by int_id asc`;
    log.d('::get - récuperation via la requête.',{ requete })

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::get - Erreur survenue lors de la récupération.',err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'intervention');
        }
        else {
            const intervention = result.rows && result.rows.length && result.rows[0];
            if (!intervention) {
                log.w('::get - Intervention inexistante.')
                return res.status(400).json({ message: 'Intervention inexistante' });
            }
            log.i('::get - Done')
            res.json({ intervention: formatIntervention(intervention) });
        }
    })
});



router.get('/', async function (req, res) {
    log.i('::list - In')
    if(!req.session.user){ 
        log.w('::list - User manquant.')
        return res.sendStatus(403) 
    }

    const user = req.session.user
    const utilisateurId = user.uti_id

    // Get subset of interventions depending on user profile
    var whereClause = ""
    // Utilisateur est partenaire => intervention de la structure
    //if(user.pro_id == 2){
        //whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id where utilisateur.str_id=${user.str_id} `
    //  whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id  `
    // Utilisateur est intervenant => ses interventions
    //} 
    if(user.pro_id == 3){
        // Multistructure
        //whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id where utilisateur.uti_id=${utilisateurId} `
        whereClause += `LEFT JOIN uti_str ust ON ust.ust_id = intervention.ust_id
                        LEFT JOIN utilisateur ON ust.uti_id = utilisateur.uti_id 
                        where ust.uti_id=${utilisateurId} `
    // Utilisateur Administrateur : 
    } else {
        // multistructure
        whereClause += `INNER JOIN uti_str ON uti_str.ust_id = intervention.ust_id 
                        left join detail_collectivite dco on dco.dco_id = uti_str.dco_id
                        left join type_collectivite tco on tco.tco_id = dco.tco_id
                        INNER JOIN structure ON structure.str_id = uti_str.str_id `
        // whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id INNER JOIN structure ON structure.str_id = utilisateur.str_id `
        // Exclusion des structures éducation nationale pour le profil référent
        if(user.pro_id == 4){
            whereClause += ` and structure.str_id <> 9 `
        }
    }

    // Utilisateur Administrateur : 

    const requete = `SELECT * from intervention ${whereClause} order by int_dateintervention desc`;
    log.d('::list - récuperation via la requête.',{ requete })

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::list - Erreur survenue lors de la récupération.',err.stack);
            return res.status(400).json('erreur lors de la récupération des interventions');
        }
        else {
            log.i('::list - Done')
            const interventions = result.rows.map(formatIntervention);
            res.json({ interventions });
        }
    })
});



router.put('/:id', async function (req, res) {
    const intervention = req.body.intervention

    const id = req.params.id
    log.i('::update - In', { id })

    let { nbEnfants, nbGarcons, nbFilles, commune, cai, blocId, dateIntervention, 
        commentaire, cp, utilisateurId,siteintervention,
        nbmoinssix, nbsixhuit, nbneufdix, nbplusdix,isenfantshandicapes,nbenfantshandicapes,isqpv,qpvcode, ustid ,strcorealisatrice,strcorealisatriceautre,eveid,intfinans, intfingenevelo,intfinautre,intfinaucun,inttypeans,isciteseducatives } = intervention
        
    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }
    if (nbmoinssix == '') { nbmoinssix = null }
    if (nbsixhuit == '') { nbsixhuit = null }
    if (nbneufdix == '') { nbneufdix = null }
    if (nbplusdix == '') { nbplusdix = null }

    log.d("ustid ! ", ustid)

    //insert dans la table intervention
    const requete = `UPDATE intervention 
        SET cai_id = $1,
        blo_id = $2,
        int_com_codeinsee = $3,
        int_com_codepostal = $4,
        int_com_libelle = $5,
        int_nombreenfant = $6,
        int_nombregarcon = $7,
        int_nombrefille = $8, 
        INT_NOMBREMOINSSIX = $9, 
        INT_NOMBRESIXHUIT = $10, 
        INT_NOMBRENEUFDIX = $11, 
        INT_NOMBREPLUSDIX = $12, 
        int_dateintervention = $13,
        int_datemaj = now(),
        int_commentaire = $14,
        int_dep_num = $15,
        int_reg_num = $16,
        int_siteintervention = $17,
        int_isenfantshandicapes = $18,
        int_nbenfantshandicapes = $19,
        int_isqpv = $20,
        int_qpv_code = $21,
        ust_id = $22,
        str_id_co_realise = $23,
        int_corealiseautre = $24,
        eve_id = $25,
        int_fin_ans = $26,
        int_fin_gene_velo = $27,
        int_fin_autre = $28,
        int_fin_aucun = $29,
        int_type_ans = $30,
        int_isciteseducatives = $31
        WHERE int_id = ${id}
        RETURNING *
        ;`    
    
    log.d('::update - requete', { requete })
    pgPool.query(requete, [cai,
        blocId,
        commune.cpi_codeinsee,
        cp,
        commune.com_libellemaj,
        nbEnfants,
        nbGarcons,
        nbFilles, 
        nbmoinssix, 
        nbsixhuit, 
        nbneufdix, 
        nbplusdix, 
        dateIntervention,
        commentaire,
        commune.dep_num,
        commune.reg_num,
        siteintervention,
        isenfantshandicapes,
        nbenfantshandicapes,
        isqpv,
        qpvcode,
        ustid,
        strcorealisatrice,
        strcorealisatriceautre,
        eveid,
        Boolean(intfinans), 
        Boolean(intfingenevelo),
        Boolean(intfinautre),
        Boolean(intfinaucun),
        inttypeans,
        isciteseducatives], (err, result) => {
        if (err) {
            log.w('::update - erreur lors de la récupération', { requete, erreur: err.stack})
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention');
        }
        else {
            log.i('::update - Done')
            // generation du pdf (synchrone)
            if (blocId == 3 ) {
                myPdf.generate(id,nbEnfants, dateIntervention,ustid,strcorealisatrice,strcorealisatriceautre)  
            }
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });

        }
    })
})

router.post('/', function (req, res) {
    log.i('::post - In')
    const intervention = req.body.intervention

    let { nbEnfants,  nbGarcons, nbFilles, commune, cai, blocId, dateIntervention,
         commentaire, cp, utilisateurId, siteintervention,
         nbmoinssix, nbsixhuit, nbneufdix, nbplusdix,
         isenfantshandicapes, nbenfantshandicapes, isqpv, qpvcode,ustid,strcorealisatrice,strcorealisatriceautre,eveid,intfinans, intfingenevelo,intfinautre,intfinaucun, inttypeans,isciteseducatives } = intervention
    
    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }
    if (nbmoinssix == '') { nbmoinssix = null }
    if (nbsixhuit == '') { nbsixhuit = null }
    if (nbneufdix == '') { nbneufdix = null }
    if (nbplusdix == '') { nbplusdix = null }

    //insert dans la table intervention
    const requete = `insert into intervention 
                    (cai_id,blo_id,uti_id,int_com_codeinsee,int_com_codepostal,int_com_libelle,
                        int_nombreenfant,int_nombregarcon,int_nombrefille,int_dateintervention,
                        int_datecreation,int_datemaj,int_commentaire,
                        int_dep_num,int_reg_num,int_siteintervention,
                        INT_NOMBREMOINSSIX, INT_NOMBRESIXHUIT, INT_NOMBRENEUFDIX, INT_NOMBREPLUSDIX,
                        int_isenfantshandicapes,
                        int_nbenfantshandicapes,
                        int_isqpv,
                        int_qpv_code, 
                        ust_id,
                        str_id_co_realise,
                        int_corealiseautre,
                        eve_id,
                        int_fin_ans, 
                        int_fin_gene_velo,
                        int_fin_autre,
                        int_fin_aucun,
                        int_type_ans,
                        int_isciteseducatives
                        ) 
                    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34 ) RETURNING *`;
    
    log.d('::post - requete',{ requete });
    pgPool.query(requete, [cai,blocId,utilisateurId,commune.cpi_codeinsee,cp,commune.com_libellemaj,
    nbEnfants, nbGarcons, nbFilles,dateIntervention,new Date().toISOString(),new Date().toISOString(),commentaire, 
    commune.dep_num, commune.reg_num,siteintervention,nbmoinssix, nbsixhuit, nbneufdix, nbplusdix, 
    isenfantshandicapes, nbenfantshandicapes, isqpv, qpvcode, ustid, strcorealisatrice,strcorealisatriceautre,eveid,Boolean(intfinans), Boolean(intfingenevelo),Boolean(intfinautre),Boolean(intfinaucun),inttypeans, isciteseducatives],(err, result) => {
        if (err) {
            log.w('::post - Erreur lors de la requête.',err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention');
        }
        else {
            log.i('::post - Done', { rows: result.rows })
            // generation du pdf (synchrone)
            if (blocId == 3) {
              myPdf.generate(result.rows.map(formatIntervention)[0].id,nbEnfants,dateIntervention,result.rows.map(formatIntervention)[0].ustid,result.rows.map(formatIntervention)[0].strcorealisatrice,result.rows.map(formatIntervention)[0].strcorealisatriceautre);
            }
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });
        }
    })
})

module.exports = router;