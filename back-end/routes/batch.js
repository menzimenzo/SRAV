const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
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
    }

    if(intervention.blo_libelle){
        result.blocLib = intervention.blo_libelle
    }

    if(intervention.cai_libelle){
        result.caiLib = intervention.cai_libelle
    }

    return result
}

// V1.0.1 : Création du socle technique pour l'envoie de mail de relance
// A compléter en V1.0.2
// Mantis N°68057
router.get('/mailrelance', async function (req, res) {

    // const requete =`SELECT utilisateur.uti_id,int_id,sin_id, int_dateintervention, int_datemaj, int_commentaire
    const requete =`SELECT *
        from intervention 
        LEFT JOIN bloc ON bloc.blo_id = intervention.blo_id 
        LEFT JOIN cadreintervention ON cadreintervention.cai_id = intervention.cai_id 
        LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id 
        where (intervention.sin_id is null or intervention.sin_id < 3)
        and intervention.int_datemaj < intervention.int_dateintervention
        and (intervention.int_dateintervention + INTERVAL '7 day') < current_date 
        order by utilisateur.uti_id, intervention.int_dateintervention`;
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

module.exports = router;