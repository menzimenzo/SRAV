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

    const requete =`SELECT * from utilisateur where str_id=${id} order by uti_id asc`;
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
/*
router.put('/:id', async function (req, res) {
    const user = req.body.intervention

    const id = req.params.id
    let { nbEnfants, nbGarcons, nbFilles, commune, cai, blocId, dateIntervention, commentaire, cp } = intervention
    
    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }


    console.log('Contenu de la commune :');
    console.log('%O', commune);

    const utilisateurId = 1; // TODO à récupérer via POST ?

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
        int_reg_num = '${commune.reg_num}'
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
            
            // generation du pdf
            if (blocId == 3 ) {
              myPdf.generate(id)  
            }
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });

        }
    })
})

router.post('/', function (req, res) {
    const intervention = req.body.intervention

    let { nbEnfants,  nbGarcons, nbFilles, commune, cai, blocId, dateIntervention, commentaire, cp } = intervention
    
    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }

    console.log('Contenu de la commune :');
    console.log('%O', commune);

    // TODO uti_id
    const utilisateurId = 1; // TODO à récupérer via POST ?
    //insert dans la table intervention
    const requete = `insert into intervention 
                    (cai_id,blo_id,uti_id,int_com_codeinsee,int_com_codepostal,int_com_libelle,int_nombreenfant,int_nombregarcon,int_nombrefille,int_dateintervention,int_datecreation,int_commentaire,int_dep_num,int_reg_num) 
                    values(${cai},${blocId},${utilisateurId},'${commune.cpi_codeinsee}','${cp}','${commune.com_libellemaj}', ${nbEnfants}, ${nbGarcons}, ${nbFilles},'${dateIntervention}', now(),'${commentaire}', '${commune.dep_num}', '${commune.reg_num}') RETURNING *`;
    
    console.log({ requete });
    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention');
        }
        else {
            //console.log({ result, rows: result.rows });

            // generation du pdf
            if (blocId == 3) {
              myPdf.generate(result.rows.map(formatIntervention)[0].id)
            }
            //const idIntervention = result.rows.map(formatIntervention)[0].id;
            
            return res.status(200).json({ intervention: result.rows.map(formatIntervention)[0] });
        }
    })
})
*/


module.exports = router;