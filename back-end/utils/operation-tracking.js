const pgPool = require('../pgpool').getPool()
const logger = require('./logger')
const log = logger(module.filename)

const tracker = function () {

    return {

        log : function (utilisateurMakerId, utilisateurMakerProfilId,
                        utilisateurTargetId, utilisateurTargetProfilId,
                        objectTargetId, objectTargetType, objectTargetName,
                        eventAction, eventMessage) {

            let requete = "INSERT INTO application_event_tracking (uti_maker_id, pro_maker_id, uti_target_id, pro_target_id, object_target_id, object_target_type, object_target_name, event_action, event_message, event_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now()) RETURNING *"

            return pgPool.query(requete, [utilisateurMakerId, utilisateurMakerProfilId, utilisateurTargetId, utilisateurTargetProfilId, objectTargetId, objectTargetType, objectTargetName, eventAction, eventMessage], (err, result) => {
                if (err) {
                    log.w('::get - Erreur lors de l\'insertion de la requete tracking', { utilisateurMakerId, utilisateurMakerProfilId, utilisateurTargetId, utilisateurTargetProfilId, objectTargetId, objectTargetType, objectTargetName, eventAction, eventMessage, erreur: err.stack })
                }
            })
        }
    }
}

module.exports = tracker