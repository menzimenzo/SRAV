/**
 * Format the url use in the redirection call
 * to the France Connect Authorization and logout API endpoint.
 * @see @link{ https://partenaires.franceconnect.gouv.fr/fcp/fournisseur-service# }
 */

var config = require('../config')
var moment = require('moment');
moment().format();
const fs = require('fs');

module.exports = {

  // TODO hard code state et nonce because they normally generate from every request
  getAuthorizationUrl : () => `${config.franceConnect.FC_URL}${config.franceConnect.AUTHORIZATION_FC_PATH}?`
    + `response_type=code&client_id=${config.franceConnect.CLIENT_ID}&redirect_uri=${config.franceConnect.FS_URL}`
    + `${config.franceConnect.CALLBACK_FS_PATH}&scope=${config.franceConnect.SCOPES}&state=customState11&nonce=customNonce11`
  
  
  /**
   * Format the url 's that is used in a redirect call to France Connect logout API endpoint
   * @returns {string}
   */
   , getLogoutUrl : req => `${config.franceConnect.FC_URL}${config.franceConnect.LOGOUT_FC_PATH}?id_token_hint=`
    + `${req.session.idToken}&state=customState11&post_logout_redirect_uri=${config.franceConnect.FS_URL}`
    + `${config.franceConnect.LOGOUT_FS_PATH}`

  , formatUtilisateur : (utilisateur, toClient = true) => {
    if(toClient){
      return {
            id: utilisateur.uti_id,
            authId: utilisateur.uti_authid,
            profilId: utilisateur.pro_id,
            structureId: utilisateur.str_id,
            statutId: utilisateur.stu_id,
            mail: utilisateur.uti_mail,
            nom: utilisateur.uti_nom,
            prenom: utilisateur.uti_prenom,
            structureLocale: utilisateur.uti_structurelocale,
            tokenFc: utilisateur.uti_tockenfranceconnect,
            validated: utilisateur.validated,
            typeCollectivite: utilisateur.str_typecollectivite,
            libelleCollectivite: utilisateur.str_libelle,
            siteweb:utilisateur.uti_siteweb,
            adresse:utilisateur.uti_adresse,
            compladresse:utilisateur.uti_complementadresse,
            codeinsee:utilisateur.uti_com_codeinsee,
            codepostal:utilisateur.uti_com_codepostal,
            mailcontact:utilisateur.uti_mailcontact,
            telephone:utilisateur.uti_telephone,
            autorisepublicarte:utilisateur.uti_autorisepublicarte,
            formgenevelo: utilisateur.uti_form_gene_velo,
            ustid:utilisateur.ust_id,
      }
    } else { 
      return {
            uti_id : utilisateur.id ,
            uti_authid: utilisateur._id ,
            pro_id : utilisateur.profilId ,
            str_id : utilisateur.structureId ,
            stu_id : utilisateur.statutId ,
            uti_mail : utilisateur.mail && utilisateur.mail.toLowerCase() ,
            uti_nom : utilisateur.nom ,
            uti_prenom : utilisateur.prenom ,
            uti_structurelocale : utilisateur.structureLocale ,
            uti_tockenfranceconnect : utilisateur.tokenFc ,
            validated: utilisateur.validated,
            typeCollectivite: utilisateur.typeCollectivite,
            libelleCollectivite: utilisateur.libelleCollectivite,
            uti_siteweb: utilisateur.siteweb,
            uti_adresse: utilisateur.adresse,
            uti_complementadresse: utilisateur.compladresse,
            uti_com_codeinsee: utilisateur.codeinsee,
            uti_com_codepostal: utilisateur.codepostal,
            uti_mailcontact: utilisateur.mailcontact  && utilisateur.mailcontact.toLowerCase() ,
            uti_telephone: utilisateur.telephone,
            uti_autorisepublicarte: utilisateur.autorisepublicarte,
            uti_form_gene_velo: utilisateur.formgenevelo,
            ust_id: utilisateur.ust_id,
        }
    }
  }
  , formatEmail: mail => mail && mail.trim().toLowerCase()
  , formatIntervention : (intervention) => {

    const result = {
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
        dateIntervention: intervention.dateintervention,
        dateCreation: new Date(intervention.int_datecreation),
        dateMaj: intervention.int_datemaj,
        commentaire: intervention.int_commentaire,
        siteintervention: intervention.int_siteintervention,
        mailrelance: intervention.int_relancemail,
        interventionACompleter: false,
        interventionAVerifier: false,
        corpsMail: null,
        uti_mail: intervention.uti_mail,
        isenfantshandicapes: intervention.int_isenfantshandicapes,
        nbenfantshandicapes: intervention.int_nbenfantshandicapes,
        isqpv: intervention.int_isqpv,
        qpvcode: intervention.int_qpv_code,
        eveid: intervention.eve_id,
        isciteseducatives: intervention.int_isciteseducatives,
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
  },
  logTrace : (batch,codeerreur,startTime) => {
    const now = new Date();
    var jour = now.getDate().toString().padStart(2, "0");
    var mois = now.getMonth().toString().padStart(2, "0");
    var annee = now.getFullYear();
    var heure = now.getHours().toString().padStart(2, "0");
    var minute = now.getMinutes().toString().padStart(2, "0");
    var dateTimeFormate = annee + mois + jour + heure + minute;

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
    // L'appel à formatDate() ne fonctionne plus. A voir pourquoi. Duplication de code en attendant
    //var contenu = formatDate() + '|' + codeerreur + '|' + checkLog + '|ExecTime=' + execTime;
    var contenu = dateTimeFormate + '|' + codeerreur + '|' + checkLog + '|ExecTime=' + execTime;


    fs.writeFile(fichierSupervision + '/batch.' + batch + '.txt', contenu, function (err) {
        if (err) throw err;
      });    
  },
  formatDate : () => { // Renvoi la date et heure actuelle formatée AAAAMMJJHHMM
    const now = new Date();
    var jour = now.getDate().toString().padStart(2, "0");
    var mois = now.getMonth().toString().padStart(2, "0");
    var annee = now.getFullYear();
    var heure = now.getHours().toString().padStart(2, "0");
    var minute = now.getMinutes().toString().padStart(2, "0");
    var dateTimeFormate = annee + mois + jour + heure + minute;
    return dateTimeFormate;
  },
  formatEvenement: (evenement, toClient = true) => {
    if(toClient) {
      return {
          id: evenement.eve_id,
          titre: evenement.eve_titre,
          datedebut: evenement.eve_date_debut,
          datefin: evenement.eve_date_fin,
          toutesstructures: evenement.eve_toutes_structures
      }
    } else {
      return {
          eve_id: evenement.id,
          eve_titre : evenement.titre,
          eve_date_debut: evenement.datedebut,
          eve_date_fin: evenement.datefin,
          eve_toutes_structures: evenement.toutesstructures
      }
    }
  }
}