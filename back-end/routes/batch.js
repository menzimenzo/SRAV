const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
const config = require('../config');
const {sendEmail} = require('../utils/mail-service');
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
        siteintervention: intervention.int_siteintervention,
        mailrelance: intervention.int_relancemail,
        interventionACompleter: false,
        interventionAVerifier: false,
        corpsMail: null
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

    // Lancement du batch http://localhost:3001/api/batch/mailrelance

    var objetMail;
    var nbIntervention;
    var idUtilisateurCourant;
    var nomUtilisateurCourant;
    var mailUtilisateurCourant;
    var interventionACompleter;
    var interventionAVerifier;
    var premierUtilisateur;
    var corpsMail;
    var dateaffichee;
    var dernierEnregistrement;
    var compteInterventions;

    // const requete =`SELECT utilisateur.uti_id,int_id,sin_id, int_dateintervention, int_datemaj, int_commentaire
    const requete =`SELECT *
        from intervention 
        LEFT JOIN bloc ON bloc.blo_id = intervention.blo_id 
        LEFT JOIN cadreintervention ON cadreintervention.cai_id = intervention.cai_id 
        LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id 
        where (intervention.int_relancemail = 0)
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
            
            //console.info(result.rows);
            //console.info(result.rows.length);
            const nombreInterventions = result.rows.length;
            const interventions = result.rows.map(formatIntervention);
            premierUtilisateur = true;
            corpsMail = '';
            dernierEnregistrement = false;
            compteInterventions = 0;
            nbIntervention = 0;
            interventionACompleter = false;
            interventionAVerifier = false;            
            interventions.forEach(intervention => {

                compteInterventions = compteInterventions + 1;
                console.info(`Traitement de l'enregistrement N°` + compteInterventions);

                //intervention.dateCreation     = new Date(intervention.dateCreation);
                //intervention.dateIntervention = intervention.dateIntervention.toISOString();
                dateaffichee = intervention.dateIntervention.toISOString().substr(8,2)+"/"+intervention.dateIntervention.toISOString().substr(5,2)+"/"+intervention.dateIntervention.toISOString().substr(0,4);


                if (premierUtilisateur == true) {
                    console.info(`Premier enregistrement`);
                    idUtilisateurCourant = intervention.utiId;
                    nomUtilisateurCourant = intervention.nom;
                    mailUtilisateurCourant = intervention.uti_mail;

                    premierUtilisateur = false;
                }
                // On choppe le denier enregistremetn pour envoyer le mail 
                if (compteInterventions == nombreInterventions) {
                    console.info(`Dernier enregistrement`);
                    dernierEnregistrement = true;
                }




                if (idUtilisateurCourant == intervention.utiId) {
                    nbIntervention = nbIntervention + 1;
                    corpsMail = corpsMail + `Intervention N°` + intervention.id + ` réalisée le ` + dateaffichee + `. Bloc d’intervention ` + intervention.blocId + ` à ` + intervention.commune.com_libellemaj + `<br/>`;
                    // Envoi d'un mail pour chaque utilisateur avec le résumé de ce qui l'attend
                    if (intervention.nbFilles == null ||
                        intervention.nbGarcons == null ||
                        intervention.nbmoinssix == null ||
                        intervention.nbsixhuit == null ||
                        intervention.nbneufdix == null ||
                        intervention.nbplusdix == null ||
                        intervention.siteintervention == null ||
                        intervention.commentaire == null) 
                    {
                        corpsMail = corpsMail + `Merci de compléter les informations manquantes et d'enregistrer<br/>`
                        if (intervention.nbFilles == null) { corpsMail = corpsMail + `- Nombre de garçons<br/>` }
                        if (intervention.nbGarcons == null) { corpsMail = corpsMail + `- Nombre de filles<br/>` }
                        if (intervention.nbmoinssix == null) { corpsMail = corpsMail + `- Nombre d’enfants -6 ans<br/>` }
                        if (intervention.nbsixhuit == null) { corpsMail = corpsMail + `- Nombre d’enfants 6-7-8 ans<br/>` }
                        if (intervention.nbneufdix == null) { corpsMail = corpsMail + `- Nombre d'enfants 9-10 ans<br/>` }
                        if (intervention.nbplusdix == null) { corpsMail = corpsMail + `- Nombre d’enfants plus de 10 ans<br/>` }
                        if (intervention.siteintervention == null) { corpsMail = corpsMail + `- Site d’intervention<br/>` }
                        if (intervention.commentaire == null) { corpsMail = corpsMail + `- Commentaires<br/>` }
                        interventionACompleter = true;
                        intervention.interventionACompleter = true;
                    }
                    else
                    {
                        console.log('interventionAVerifier',interventionAVerifier);
                        interventionAVerifier = true;
                        intervention.interventionAVerifier = true;
                    }
                    corpsMail = corpsMail + `<br/>`;
                }

                
                // Si l'utilisateur a changé ou que c'est le dernier enregistrement alors on envoi le mail
                if (idUtilisateurCourant != intervention.utiId || dernierEnregistrement == true) {
            
                    objetMail = `[SRAV] Intervention`;
                    var EnteteMail; 
                    EnteteMail = `Bonjour ` + nomUtilisateurCourant + `<br/><br/>`;
                    EnteteMail = EnteteMail + `Vous êtes intervenu(e) sur le site du programme « Savoir rouler à vélo » pour la déclaration`;
                    // Ajout du "s" s'il y a plusieurs internentions
                    if (nbIntervention > 1) {
                        objetMail = objetMail + `s à `;
                        EnteteMail = EnteteMail + ` d’interventions</br>`;
                    }
                    else {
                        objetMail = objetMail + ` à `;
                        EnteteMail = EnteteMail + ` d’une intervention</br>`;
                    }
                    if (interventionACompleter == true) {
                        objetMail = objetMail + `compléter`
                        if (interventionAVerifier == true) {
                            objetMail = objetMail + `/`;
                        }
                    } 
                    if (interventionAVerifier == true) {
                        objetMail = objetMail + `vérifier`;
                    }
                    EnteteMail = EnteteMail + `Afin de disposer d’indicateurs sur le public formé, nous vous invitons à vérifier/compléter vos données sur https://savoirrouleravelo.fr/intervenant`; 

                    corpsMail = EnteteMail + `<br/><br/>` + corpsMail;
                    corpsMail = corpsMail + `<br/>`;
                    corpsMail = corpsMail + `Cordialement,<br/><br/>`;
                    corpsMail = corpsMail + `L’équipe « Savoir rouler à vélo »`;
                    intervention.corpsMail = corpsMail;
    
                    sendEmail({
                        to: mailUtilisateurCourant,
                        subject: objetMail,
                        body: corpsMail
                        /*`<p>Bonjour,</p>
                            <p>Votre compte « Intervenant Savoir Rouler à Vélo » a bien été créé. <br/><br/>
                            Nous vous invitons à y renseigner les informations relatives à la mise en œuvre de chacun des 3 blocs du socle commun du SRAV.<br/>
                            Le site <a href="www.savoirrouleravelo.fr">www.savoirrouleravelo.fr</a> est à votre disposition pour toute information sur le programme Savoir Rouler à Vélo.<br/></p>`*/
                    })
                }                


                // On change d'utilisateur, on réinitalise les données associées
                if (idUtilisateurCourant != intervention.utiId) {
                    idUtilisateurCourant = intervention.utiId;
                    nomUtilisateurCourant = intervention.nom;
                    mailUtilisateurCourant = intervention.uti_mail;
                    nbIntervention = 0;
                    interventionACompleter = false;
                    interventionAVerifier = false;
                    corpsMail = ``;
                    EnteteMail = ``;
                }                                    

            })


            res.json({ interventions });
        }
    })
});

module.exports = router;