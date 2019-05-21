const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
var fs = require('fs');
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
    var startTime = new Date();
    const clauseWhere =  `where 
                        int_dateintervention <= current_date 
                        AND
                        (
                            -- Conditions de départ pour savoir si l’intervention n’a pas été modifiée à postériori
                            (to_char(int_datecreation,'DD/MM/YYYY') = to_char(int_dateintervention ,'DD/MM/YYYY')
                            AND to_char(int_datemaj,'DD/MM/YYYY') =  to_char(int_dateintervention ,'DD/MM/YYYY'))
                            OR
                            (int_datecreation < int_dateintervention 
                            AND int_datemaj < int_dateintervention)
                        )
                        AND
                        (
                            (
                            -- Condition relance fait sur le premier jour : 0 : La relance n’a pas été faite
                            intervention.int_relancemail = 0
                            AND to_char(int_dateintervention,'YYYMMDD') <= to_char(current_date,'YYYMMDD')
                            )
                            OR
                            (
                            -- Condition relance fait sur au bout de 7 jours : 1 : La relance n’a pas été faite
                            intervention.int_relancemail = 1
                            AND 
                            (int_dateintervention + INTERVAL '7 day') <= current_date
                            )
                        )`;

    const requete =`SELECT *
            from intervention 
            LEFT JOIN bloc ON bloc.blo_id = intervention.blo_id 
            LEFT JOIN cadreintervention ON cadreintervention.cai_id = intervention.cai_id 
            LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id ` + clauseWhere 
            + ` order by utilisateur.uti_id, intervention.int_dateintervention`;

    console.log(requete)

    pgPool.query(requete, (err, result) => {
        if (err) {
            console.log(err.stack);
            logTrace('srav-mailrelance',2,startTime);
            return res.status(400).json('[BATCH-RELANCEMAIL] erreur lors de la récupération des interventions');
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
/*
Afin de superviser le batch, celui-ci doit retourner dans un fichier /var/tmp/batch.nombatch.txt une réponse au format:
timestamp|codederetour|log|ExecTime
Exemple:
1520510369|0|Check log file /var/log/srv-batch/srv-batch.log|ExecTime=48
Voici les différents codes de retour possible:
STATE_OK=0
STATE_WARNING=1
STATE_CRITICAL=2
STATE_UNKNOWN=3
STATE_DEPENDENT=4
*/
            // Mise à jour des interventions relancemail = 1 ou 2 en fonction de son état précédent
            const requete = `UPDATE intervention 
            SET int_relancemail = int_relancemail + 1 `
            + clauseWhere  + ` RETURNING * ;`    
            console.log(requete);
            pgPool.query(requete, (err, result) => {
                if (err) {
                    console.log(requete);
                    console.log(err.stack);
                    logTrace('srav-mailrelance',1,startTime);
                    return res.status(400).json('[BATCH-RELANCEMAIL] erreur lors de la mise à jour de la relance mail');
                }
            })
            logTrace('srav-mailrelance',0,startTime);
            res.json({ interventions });
        }
    })
});

router.get('/testmail', function (req, res) {

    var startTime = new Date();
    v_email = req.query.email;
    console.log ('EMail  : ' + v_email);
    // Lancement du batch http://localhost:3001/api/batch/mailrelance
    sendEmail({
        to: v_email,
        subject: '[SRAV] Mail de test',
        body: `<p>Bonjour,</p>
            <p>Ce mail est un mail de test.<br/><br/>
            <p>Si vous le recevez et que vous ne deviez pas en être destinataire, alors merci de l'ignorer</p>`
    });
    //return res.statusCode(400).json({ message: 'erreur sur la requete de listcommune' });
    logTrace('srav--testmail',0,startTime)

    return res.send(formatDate());
});

function logTrace(batch,codeerreur,startTime) {
    var execTime = new Date() - startTime;
    var fichierSupervision = config.PATH_SUPERVISION_BATCH;
    var checkLog;
    if (codeerreur == 0) {
        checkLog = '';
    }
    else
    {
        checkLog = 'Check log Backend SRAV';
    }    
    var contenu = formatDate() + '|' + codeerreur + '|' + checkLog + '|ExecTime=' + execTime;

    console.log(contenu + ' - Path Supervision');
    fs.writeFile(fichierSupervision + '\\batch.' + batch + '.txt', contenu, function (err) {
        if (err) throw err;
        console.log(contenu + ' - Saved!');
      });    
 } 


 function formatDate() { // Renvoi la date et heure actuelle formatée AAAAMMJJHHMM
    const now = new Date();
    var jour = now.getDate().toString().padStart(2, "0");
    var mois = now.getMonth().toString().padStart(2, "0");
    var annee = now.getFullYear();
    var heure = now.getHours().toString().padStart(2, "0");
    var minute = now.getMinutes().toString().padStart(2, "0");
    var dateTimeFormate = annee + mois + jour + heure + minute;
    return dateTimeFormate;
}


module.exports = router;