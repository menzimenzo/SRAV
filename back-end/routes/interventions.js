const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
const stringify                                        = require('csv-stringify')
const myPdf = require('../utils/pdf')
var moment = require('moment');
moment().format();


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
        siteintervention: intervention.int_siteintervention
    }

    if(intervention.uti_nom){
        result.nom = intervention.uti_prenom + ' ' + intervention.uti_nom
        result.structure = intervention.str_libellecourt
        result.structureId = intervention.str_id
    }

    if(intervention.blo_libelle){
        result.blocLib = intervention.blo_libelle
    }

    if(intervention.cai_libelle){
        result.caiLib = intervention.cai_libelle
    }


    return result
}


router.get('/delete/:id', async function (req, res) {
    const intervention = req.body.intervention;

    const id = req.params.id;

    //insert dans la table intervention
    const requete = `DELETE FROM  intervention 
        WHERE int_id = $1
        RETURNING *
        ;`;
    
    pgPool.query(requete, [id], (err, result) => {
        if (err) {
            console.log(requete);
            console.log(err.stack);
            return res.status(400).json('erreur lors de la suppression de l\'intervention ' + id);
        }
        else {
            
            // Suppression effectuée avec succès
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });

        }
    })
})

router.get('/csv/:utilisateurId', async function (req, res) {

    const utilisateurId = req.params.utilisateurId; // TODO à récupérer via POST ?

    const requete =`SELECT * from intervention 
    LEFT JOIN bloc ON bloc.blo_id = intervention.blo_id 
    LEFT JOIN cadreintervention ON cadreintervention.cai_id = intervention.cai_id 
    LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id 
    where utilisateur.uti_id=${utilisateurId} order by int_id asc`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'intervention');
        }
        else {
            var interventions = result.rows;
            interventions = interventions.map(intervention => {
                var newIntervention = formatIntervention(intervention)
                delete newIntervention.commune
                newIntervention.commune = intervention.int_com_libelle
                newIntervention.codeinsee = intervention.int_com_codeinsee
                newIntervention.dep_num = intervention.int_dep_num
                newIntervention.reg_num = intervention.int_reg_num
                newIntervention.dateIntervention = newIntervention.dateIntervention.toISOString(),
                newIntervention.dateCreation = newIntervention.dateCreation.toISOString(),
                newIntervention.dateMaj = newIntervention.dateMaj.toISOString()
                return newIntervention
            })
            if (!interventions || !interventions.length) {
                return res.status(400).json({ message: 'Interventions inexistante' });
            }
            stringify(interventions, {
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
        }
    })
});

router.get('/:id', async function (req, res) {

    if(!req.session.user){
        return res.sendStatus(403)
    }
    const id = req.params.id
    const user = req.session.user
    const utilisateurId = user.uti_id

    // Where condition is here for security reasons.
    var whereClause = ""
    if(user.pro_id == 3){
        whereClause += ` and uti_id=${utilisateurId} `
    }

    const requete =`SELECT * from intervention where int_id=${id} ${whereClause} order by int_id asc`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'intervention');
        }
        else {
            const intervention = result.rows && result.rows.length && result.rows[0];
            if (!intervention) {
                return res.status(400).json({ message: 'Intervention inexistante' });
            }
            res.json({ intervention: formatIntervention(intervention) });
        }
    })
});

router.get('/', async function (req, res) {
    if(!req.session.user){ 
        return res.sendStatus(403) 
    }

    const user = req.session.user
    const utilisateurId = user.uti_id

    // Get subset of interventions depending on user profile
    var whereClause = ""
    // Utilisateur est partenaire => intervention de la structure
    if(user.pro_id == 2){
        whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id where utilisateur.str_id=${user.str_id} and int_commentaire is not null and int_commentaire <> ''`
    // Utilisateur est intervenant => ses interventions
    } else if(user.pro_id == 3){
        whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id where utilisateur.uti_id=${utilisateurId} `
    // Utilisateur Administrateur : Exclusion des interventions sans commentaires
    } else if(user.pro_id == 1){
        whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id LEFT JOIN structure ON structure.str_id = utilisateur.str_id `
    }

    const requete = `SELECT * from intervention ${whereClause} order by int_dateintervention desc`;
    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la récupération des interventions');
        }
        else {
            console.info(result.rows)
            const interventions = result.rows.map(formatIntervention);
            res.json({ interventions });
        }
    })
});

router.put('/:id', async function (req, res) {
    const intervention = req.body.intervention

    const id = req.params.id
    let { nbEnfants, nbGarcons, nbFilles, commune, cai, blocId, dateIntervention, 
        commentaire, cp, utilisateurId,siteintervention,
        nbmoinssix, nbsixhuit, nbneufdix, nbplusdix  } = intervention

    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }
    if (nbmoinssix == '') { nbmoinssix = null }
    if (nbsixhuit == '') { nbsixhuit = null }
    if (nbneufdix == '') { nbneufdix = null }
    if (nbplusdix == '') { nbplusdix = null }

    //insert dans la table intervention
    const requete = `UPDATE intervention 
        SET cai_id = $1,
        blo_id = $2,
        uti_id = $3,
        int_com_codeinsee = $4,
        int_com_codepostal = $5,
        int_com_libelle = $6,
        int_nombreenfant = $7,
        int_nombregarcon = $8,
        int_nombrefille = $9, 
        INT_NOMBREMOINSSIX = $10, 
        INT_NOMBRESIXHUIT = $11, 
        INT_NOMBRENEUFDIX = $12, 
        INT_NOMBREPLUSDIX = $13, 
        int_dateintervention = $14,
        int_datemaj = now(),
        int_commentaire = $15,
        int_dep_num = $16,
        int_reg_num = $17,
        int_siteintervention = $18
        WHERE int_id = ${id}
        RETURNING *
        ;`    
    
    pgPool.query(requete, [cai,
        blocId,
        utilisateurId,
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
        siteintervention], (err, result) => {
        if (err) {
            console.log(requete);
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention');
            
        }
        else {
            
            // generation du pdf (synchrone)
            if (blocId == 3 ) {
                myPdf.generate(id,nbEnfants, dateIntervention)  
            }
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });

        }
    })
})

router.post('/', function (req, res) {
    const intervention = req.body.intervention

    let { nbEnfants,  nbGarcons, nbFilles, commune, cai, blocId, dateIntervention,
         commentaire, cp, utilisateurId, siteintervention,
         nbmoinssix, nbsixhuit, nbneufdix, nbplusdix } = intervention
    
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
                        INT_NOMBREMOINSSIX, INT_NOMBRESIXHUIT, INT_NOMBRENEUFDIX, INT_NOMBREPLUSDIX) 
                    values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20 ) RETURNING *`;
    
    console.log({ requete });
    pgPool.query(requete, [cai,blocId,utilisateurId,commune.cpi_codeinsee,cp,commune.com_libellemaj,
    nbEnfants, nbGarcons, nbFilles,dateIntervention,new Date().toISOString(),new Date().toISOString(),commentaire, 
    commune.dep_num, commune.reg_num,siteintervention,nbmoinssix, nbsixhuit, nbneufdix, nbplusdix],(err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention');
        }
        else {
            console.log({ result, rows: result.rows });

            // generation du pdf (synchrone)
            if (blocId == 3) {
              myPdf.generate(result.rows.map(formatIntervention)[0].id,nbEnfants,dateIntervention);
            }
            
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });
        }
    })
})


module.exports = router;