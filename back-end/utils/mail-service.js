const axios = require('axios')
const config = require('../config')
const MAIL_URL = config.MAIL_URL
const SENDER_EMAIL = config.SENDER_EMAIL
const sendNotificationUrl = MAIL_URL + '/notification/sendEmail'

const sendEmail= function(payload){
    payload.from = SENDER_EMAIL
    payload.replyTo = SENDER_EMAIL
    return  axios.post(sendNotificationUrl,  payload).then(() => {
        console.log('sendStatusNotification - Done', {payload})
    })
    .catch(err => {
        console.log('sendStatusNotification', err)
    })
}

// Fonction de formatage et d'envoi du Mail
const formatAndSendMail= function(idUtilisateurCourant, IdUtilisateurIntervention, nomUtilisateurCourant, mailUtilisateurCourant, nbIntervention, interventionACompleter, interventionAVerifier, corpsMail) {
    var objetMail = ''
    var EnteteMail  = ''
    objetMail = `[SRAV] Intervention`
    var EnteteMail 
    EnteteMail = `Bonjour ` + nomUtilisateurCourant + `<br/><br/>`
    EnteteMail = EnteteMail + `Vous êtes intervenu(e) sur le site du programme « Savoir rouler à vélo » pour la déclaration`
    // Ajout du "s" s'il y a plusieurs internentions
    if (nbIntervention > 1) {
        objetMail = objetMail + `s à `
        EnteteMail = EnteteMail + ` d’interventions<br/>`
    }
    else {
        objetMail = objetMail + ` à `
        EnteteMail = EnteteMail + ` d’une intervention<br/>`
    }
    if (interventionACompleter == true) {
        objetMail = objetMail + `compléter`
        if (interventionAVerifier == true) {
            objetMail = objetMail + `/`
        }
    } 
    if (interventionAVerifier == true) {
        objetMail = objetMail + `vérifier`
    }
    EnteteMail = EnteteMail + `Afin de disposer d’indicateurs sur le public formé, nous vous invitons à vérifier/compléter vos données sur https://savoirrouleravelo.fr/intervenant` 

    corpsMail = EnteteMail + `<br/><br/>` + corpsMail
    corpsMail = corpsMail + `<br/>`
    corpsMail = corpsMail + `Cordialement,<br/><br/>`
    corpsMail = corpsMail + `L’équipe « Savoir rouler à vélo »`
    /* Mode test pour écriture mail local*/
    /*
    fs.writeFile(config.PATH_SUPERVISION_BATCH + '/' + idUtilisateurCourant + '.html', 'idUtilisateurCourant : ' + idUtilisateurCourant + '<br/><br>intervention.utiId : ' + IdUtilisateurIntervention + '<br/><br>Objet : ' + objetMail+ '<br/><br>' + corpsMail, function (err) {

        
      })    
      */
    console.log('EMail to  : ' + mailUtilisateurCourant)

    sendEmail({
        to: mailUtilisateurCourant,
        subject: objetMail,
        body: corpsMail
    })
    return 1
}

module.exports = {
    sendEmail,
    formatAndSendMail
}