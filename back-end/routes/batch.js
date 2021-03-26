const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
var fs = require('fs');
const config = require('../config');
const { sendEmail, formatAndSendMail } = require('../utils/mail-service');
const { formatIntervention, formatDate, logTrace } = require('../utils/utils')
moment().format();

const logger = require('../utils/logger')
const log = logger(module.filename)

// V1.0.1 : Création du socle technique pour l'envoie de mail de relance
// A compléter en V1.0.2
// Mantis N°68057
router.get('/mailrelance', async function (req, res) {
    log.i('::mailrelance - In')
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

    const requete =`SELECT *, to_char(int_dateintervention,'DD/MM/YYYY') as dateintervention
            from intervention 
            LEFT JOIN bloc ON bloc.blo_id = intervention.blo_id 
            LEFT JOIN cadreintervention ON cadreintervention.cai_id = intervention.cai_id 
            LEFT JOIN utilisateur ON intervention.uti_id = utilisateur.uti_id ` + clauseWhere 
            + ` order by utilisateur.uti_id, intervention.int_dateintervention`;

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::mailrelance - erreur lors de la requete',{ requete, erreur: err.stack});
            logTrace('srav-mailrelance',2,startTime);
            return res.status(400).json('[BATCH-RELANCEMAIL] erreur lors de la récupération des interventions');
        }
        else {
            log.d('::mailrelance - rows: ',result.rows.length);
            const nombreInterventions = result.rows.length;
            const interventions = result.rows.map(formatIntervention);
            premierUtilisateur = true;
            corpsMail = '';
            corpsMailTemp = '';
            dernierEnregistrement = false;
            compteInterventions = 0;
            nbIntervention = 0;
            interventionACompleter = false;
            interventionAVerifier = false;            
            interventions.forEach(intervention => {

                compteInterventions = compteInterventions + 1;
                log.d(`::mailrelance - Traitement de l'enregistrement N°` + compteInterventions);

                dateaffichee = intervention.dateIntervention;

                if (premierUtilisateur == true) {
                    log.i(`::mailrelance - Premier enregistrement`);
                    log.d(`::mailrelance - Premier enregistrement ! ` + intervention.uti_mail);
                    idUtilisateurCourant = intervention.utiId;
                    nomUtilisateurCourant = intervention.nom;
                    mailUtilisateurCourant = intervention.uti_mail;

                    premierUtilisateur = false;
                }
                // On choppe le denier enregistremetn pour envoyer le mail 
                if (compteInterventions == nombreInterventions) {
                    log.i(`::mailrelance - Dernier enregistrement`);
                    dernierEnregistrement = true;
                }

                nbIntervention = nbIntervention + 1;
                corpsMailTemp = corpsMailTemp + `Intervention N°` + intervention.id + ` réalisée le ` + dateaffichee + `. Bloc d’intervention ` + intervention.blocId + ` à ` + intervention.commune.com_libellemaj + `<br/>`;
                // Envoi d'un mail pour chaque utilisateur avec le résumé de ce qui l'attend
                if (intervention.nbFilles == null ||
                    intervention.nbGarcons == null ||
                    intervention.nbmoinssix == null ||
                    intervention.nbsixhuit == null ||
                    intervention.nbneufdix == null ||
                    intervention.nbplusdix == null ||
                    intervention.siteintervention == null ||
                    intervention.siteintervention == '' ||
                    intervention.commentaire == null ||
                    intervention.commentaire == '') 
                {
                    corpsMailTemp = corpsMailTemp + `Merci de compléter les informations manquantes et d'enregistrer<br/>`
                    if (intervention.nbFilles == null) { corpsMailTemp = corpsMailTemp + `- Nombre de filles<br/>` }
                    if (intervention.nbGarcons == null) { corpsMailTemp = corpsMailTemp + `- Nombre de garçons<br/>` }
                    if (intervention.nbmoinssix == null) { corpsMailTemp = corpsMailTemp + `- Nombre d’enfants -6 ans<br/>` }
                    if (intervention.nbsixhuit == null) { corpsMailTemp = corpsMailTemp + `- Nombre d’enfants 6-7-8 ans<br/>` }
                    if (intervention.nbneufdix == null) { corpsMailTemp = corpsMailTemp + `- Nombre d'enfants 9-10 ans<br/>` }
                    if (intervention.nbplusdix == null) { corpsMailTemp = corpsMailTemp + `- Nombre d’enfants plus de 10 ans<br/>` }
                    if (intervention.siteintervention == null || intervention.siteintervention == '') { corpsMailTemp = corpsMailTemp + `- Site d’intervention<br/>` }
                    if (intervention.commentaire == null || intervention.commentaire == '') { corpsMailTemp = corpsMailTemp + `- Commentaires<br/>` }
                    interventionACompleter = true;
                    intervention.interventionACompleter = true;
                    log.d('::mailrelance - interventionAVerifier',interventionAVerifier);
                }
                else
                {
                    corpsMailTemp = corpsMailTemp + `Merci de retourner sur l’intervention et de vérifier les informations saisies<br/>`
                    corpsMailTemp = corpsMailTemp + `Enregistrez l’intervention même si aucune information n’est modifiée<br/>`
                    log.d('::mailrelance - interventionAVerifier',interventionAVerifier);
                    interventionAVerifier = true;
                    //intervention.interventionAVerifier = true;
                }
                corpsMailTemp = corpsMailTemp + `<br/>`;

                if (idUtilisateurCourant == intervention.utiId) {
                    corpsMail = corpsMail + corpsMailTemp;
                    corpsMailTemp = '';
                }

                // Si l'utilisateur a changé ou que c'est le dernier enregistrement alors on envoi le mail
                if (idUtilisateurCourant != intervention.utiId) {
                    formatAndSendMail(idUtilisateurCourant,intervention.utiId,nomUtilisateurCourant,mailUtilisateurCourant,nbIntervention,interventionACompleter,interventionAVerifier,corpsMail);
                }


                // On change d'utilisateur, on réinitalise les données associées
                if (idUtilisateurCourant != intervention.utiId) {
                    idUtilisateurCourant = intervention.utiId;
                    nomUtilisateurCourant = intervention.nom;
                    mailUtilisateurCourant = intervention.uti_mail;
                    nbIntervention = 0;
                    interventionACompleter = false;
                    interventionAVerifier = false;
                    corpsMail = corpsMailTemp;
                    corpsMailTemp = '';
                    EnteteMail = ``;
                }   
                if (dernierEnregistrement == true) {
                    formatAndSendMail(idUtilisateurCourant,intervention.utiId,nomUtilisateurCourant,mailUtilisateurCourant,nbIntervention,interventionACompleter,interventionAVerifier,corpsMail);
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
            pgPool.query(requete, (err, result) => {
                if (err) {
                    log.w('::mailrelance - erreur lors de la mise à jour',{requete, erreur: err.stack});
                    logTrace('srav-mailrelance',1,startTime);
                    return res.status(400).json('[BATCH-RELANCEMAIL] erreur lors de la mise à jour de la relance mail');
                }
            })
            logTrace('srav-mailrelance',0,startTime);
            log.i('::mailrelance - Done')
            res.json({ interventions });
        }
    })
});

router.get('/testmail', function (req, res) {

    var startTime = new Date();
    v_email = req.query.email;
    log.i('::testmail - In, EMail  : ' + v_email);
    // Lancement du batch http://localhost:3001/api/batch/mailrelance
    sendEmail({
        to: v_email,
        subject: '[SRAV] Mail de test',
        body: `<p>Bonjour,</p>
            <p>Ce mail est un mail de test.<br/><br/>
            <p>Si vous le recevez et que vous ne deviez pas en être destinataire, alors merci de l'ignorer</p>`
    });
    //return res.statusCode(400).json({ message: 'erreur sur la requete de listcommune' });
    logTrace('srav-testmail',0,startTime)
    log.i('::testmail - Done')
    return res.send(formatDate());
});

module.exports = router;