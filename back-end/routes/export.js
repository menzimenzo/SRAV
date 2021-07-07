const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
var moment = require('moment');
var fs = require('fs');
const stringify = require('csv-stringify')
const config = require('../config');
//const { formatIntervention, formatDate, logTrace } = require('../utils/utils')
moment().format();

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
        departement:intervention.int_dep_num
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


/* route d'extraction de la liste d'utilisateurs pour le CSV */
/* Pas d'argument, on utilise la structure de l'utilisateur en session */
// Execution du batch csv localhost/backend/api/batch/csv
router.get('/contact/', async function (req, res) {
    log.i('::export - In')

    //var startTime = new Date();
    var requete = "";

    log.d('::export - Recherche des données : ' + requete);
/*    requete =`SELECT uti.uti_id As Identifiant, rol_libelle as Role, lower(uti_mail) as Courriel, replace(replace(uti_publicontact::text,'true','Oui'),'false','Non') AutorisePublicationContact, 
    lower(uti_mailcontact) MailContact, uti_sitewebcontact SiteInternetContact, uti_telephonecontact TelephoneContact, uti_adrcontact AdresseContact,
    uti_compadrcontact ComplementAdresseContact, uti_com_cp_contact CodePostalContact, uti_com_codeinseecontact CodeInseeContact, com_art ArtCommune, com_libelle LibelleCommune, dep_num Departement
    from utilisateur  uti
    inner join profil rol on rol.rol_id = uti.rol_id  and rol.rol_id in (3,4,5)
    inner join ref_eaps eaps on eaps.eap_numero = uti.uti_eaps
    left join commune com on cpi_codeinsee = uti.uti_com_codeinseecontact
    where uti.uti_validated = true and uti.uti_publicontact = true
    order by 3,4 asc`;
*/
requete =`SELECT str.str_libellecourt,
            str.str_libelle,
            uti.uti_siteweb as siteweb, 
            uti.uti_adresse as adresse,
            uti_complementadresse as compladresse,
            uti_com_codeinsee as codeinsee,
            uti_com_codepostal as codepostaluti,
            com_libelle as commune,
            uti_mailcontact as mailcontact,
            uti_telephone as telephone
            from utilisateur  uti
            inner join structure str on str.str_id = uti.str_id
            left join commune com on com.cpi_codeinsee = uti.uti_com_codeinsee
            where uti.uti_autorisepublicarte = true
            order by 3,4 asc`;
    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::csvopendatasoft - Erreur lors de la requête.', { requete, erreur: err.stack});
            //logTrace('aaq-csvods',1,startTime);
            return res.status(400).json('erreur lors de la récupération des utilisateurs');
        }
        else {
            const csv = result.rows;
            log.d(csv)
            if (!csv || !csv.length) {
                log.w('::csvopendatasoft - Résultat vide.')
                //logTrace('aaq-csvods',2,startTime);
                return res.status(400).json({ message: 'Aucun résultat renvoyé par la requête' });
            }
            stringify(csv, {
                quoted: '"',
                header: true,
                escape: '\n'
            }, (err, csvContent) => {
                if(err){
                    log.w('::csv - erreur',err)
                    //logTrace('aaq-csvods',3,startTime);
                    return res.status(500)
                } else {
                    log.d(csvContent)
                    if (req.query.csv) 
                    {
                        res.attachment(csvContent)
                        res.set('Content-Type', 'text/csv');
                        res.setHeader('Content-Disposition', 'attachment; filename=SRAV-Contact.csv');
                    }
                    return res.send(csvContent);

                }
            })            
        }
    })

    log.i('::export - Done')


});

router.get('/intervention/', async function (req, res) {
    log.i('::export - In')

    //var startTime = new Date();
    var requete = "";

    log.d('::export - Recherche des données : ' + requete);
/*    requete =`SELECT uti.uti_id As Identifiant, rol_libelle as Role, lower(uti_mail) as Courriel, replace(replace(uti_publicontact::text,'true','Oui'),'false','Non') AutorisePublicationContact, 
    lower(uti_mailcontact) MailContact, uti_sitewebcontact SiteInternetContact, uti_telephonecontact TelephoneContact, uti_adrcontact AdresseContact,
    uti_compadrcontact ComplementAdresseContact, uti_com_cp_contact CodePostalContact, uti_com_codeinseecontact CodeInseeContact, com_art ArtCommune, com_libelle LibelleCommune, dep_num Departement
    from utilisateur  uti
    inner join profil rol on rol.rol_id = uti.rol_id  and rol.rol_id in (3,4,5)
    inner join ref_eaps eaps on eaps.eap_numero = uti.uti_eaps
    left join commune com on cpi_codeinsee = uti.uti_com_codeinseecontact
    where uti.uti_validated = true and uti.uti_publicontact = true
    order by 3,4 asc`;
*/

    // ATTENTION : Ne pas toucher sans se référer au paramétrage de la cartographie opendatasoft DataSource "Savoir rouler à vélo intervention"
    requete =`SELECT to_char(int.int_dateintervention,'DD/MM/YYYY') int_dateintervention,int.int_nombreenfant , int.int_dep_num, int.int_com_libelle, int.int_com_codeinsee, int.int_com_codepostal, int.int_reg_num from intervention int
    INNER JOIN bloc blo ON blo.blo_id = int.blo_id and blo.blo_id = 3
    INNER JOIN cadreintervention cai ON cai.cai_id = int.cai_id 
    INNER JOIN utilisateur uti ON int.uti_id = uti.uti_id 
    INNER JOIN structure str ON str.str_id = uti.str_id
    order by int.int_id asc`;

    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::csv - erreur lors de la requête.',err.stack);
            return res.status(400).json('erreur lors de la récupération de l\'intervention');
        }
        else {
            var interventions = result.rows;
            /*
            interventions = interventions.map(intervention => {
                var newIntervention = formatIntervention(intervention)
                delete newIntervention.commune
                newIntervention.commune = intervention.int_com_libelle
                newIntervention.codeinsee = intervention.int_com_codeinsee
                newIntervention.dep_num = intervention.int_dep_num
                newIntervention.reg_num = intervention.int_reg_num
                newIntervention.dateIntervention = newIntervention.dateIntervention.toLocaleDateString(),
                //newIntervention.dateCreation = newIntervention.dateCreation.toISOString(),
                //newIntervention.dateMaj = newIntervention.dateMaj.toISOString()
                //delete newIntervention.structureCode;
                //delete newIntervention.structureLibelle;
                //delete newIntervention.StructureLocaleUtilisateur;
                //newIntervention.structureCode = intervention.str_libellecourt;
                //newIntervention.structureLibelle = intervention.str_libelle;
                newIntervention.StructureLocaleUtilisateur = intervention.uti_structurelocale;
                // Suppression du commentaire dans l'export CSV
                delete newIntervention.commentaire                
                
                return newIntervention
            })
            */
            if (!interventions || !interventions.length) {
                //log.w('::csv - Intervention inexistante.',err.stack);
                return res.status(400).json({ message: 'Interventions inexistante' });
            }
            stringify(interventions, {
                quoted: '"',
                header: true
            }, (err, csvContent) => {
                if(err){
                    log.w('::csv - Erreur lors callback après stringify.',err.stack);
                    return res.status(500)
                } else {
                    log.i('::csv - Done')
                    if (req.query.csv) 
                    {
                        res.attachment(csvContent)
                        res.set('Content-Type', 'text/csv');
                        res.setHeader('Content-Disposition', 'attachment; filename=SRAV-Intervention.csv');
                    }
                    return res.send(csvContent);
                }
            })
        }
    })

    log.i('::export - Done')


});
module.exports = router;