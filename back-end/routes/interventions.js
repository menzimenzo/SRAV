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
        dateIntervention: new Date(intervention.int_dateintervention),
        dateCreation: new Date(intervention.int_datecreation),
        dateMaj: intervention.int_datemaj,
        commentaire: intervention.int_commentaire,
        siteintervention: intervention.int_siteintervention
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

    return result
}

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
        whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id where utilisateur.str_id=${user.str_id}`
    // Utilisateur est intervenant => ses interventions
    } else if(user.pro_id == 3){
        whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id where utilisateur.uti_id=${utilisateurId} `
    // Utilisateur Administrateur : Exclusion des interventions sans commentaires
    } else if(user.pro_id == 1){
        whereClause += `LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id WHERE int_commentaire is not null and int_commentaire <> ''`
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
    let { nbEnfants, nbGarcons, nbFilles, commune, cai, blocId, dateIntervention, commentaire, cp, utilisateurId,siteintervention } = intervention

    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }

    //insert dans la table intervention
    const requete = `UPDATE intervention 
        SET cai_id = ${cai},
        blo_id = ${blocId},
        uti_id = ${utilisateurId},
        int_com_codeinsee = '${commune.cpi_codeinsee}',
        int_com_codepostal = '${cp}',
        int_com_libelle = '${commune.com_libellemaj}',
        int_nombreenfant = ${nbEnfants},
        int_nombregarcon = ${nbGarcons},
        int_nombrefille = ${nbFilles}, 
        int_dateintervention = '${dateIntervention}',
        int_datemaj = now(),
        int_commentaire = '${commentaire}',
        int_dep_num = '${commune.dep_num}',
        int_reg_num = '${commune.reg_num}',
        int_siteintervention = '${siteintervention}'
        WHERE int_id = ${id}
        RETURNING *
        ;`    
    
    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(requete);
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention');
            
        }
        else {
            
            // generation du pdf (synchrone)
            if (blocId == 3 ) {
              myPdf.generate(id,nbEnfants)  
            }
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });

        }
    })
})

router.post('/', function (req, res) {
    const intervention = req.body.intervention

    let { nbEnfants,  nbGarcons, nbFilles, commune, cai, blocId, dateIntervention, commentaire, cp, utilisateurId, siteintervention } = intervention
    
    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }

    //insert dans la table intervention
    const requete = `insert into intervention 
                    (cai_id,blo_id,uti_id,int_com_codeinsee,int_com_codepostal,int_com_libelle,int_nombreenfant,int_nombregarcon,int_nombrefille,int_dateintervention,int_datecreation,int_datemaj,int_commentaire,int_dep_num,int_reg_num,int_siteintervention) 
                    values(${cai},${blocId},${utilisateurId},'${commune.cpi_codeinsee}','${cp}','${commune.com_libellemaj}', ${nbEnfants}, ${nbGarcons}, ${nbFilles},'${dateIntervention}', '${new Date().toISOString()}', '${new Date().toISOString()}','${commentaire}', '${commune.dep_num}', '${commune.reg_num}','${siteintervention}') RETURNING *`;
    
    console.log({ requete });
    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention');
        }
        else {
            console.log({ result, rows: result.rows });

            // generation du pdf (synchrone)
            if (blocId == 3) {
              myPdf.generate(result.rows.map(formatIntervention)[0].id,nbEnfants)
            }
            
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });
        }
    })
})


module.exports = router;