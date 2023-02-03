const pgPool = require('../pgpool').getPool()

const { postTrace } = require('.')
const logger = require('../utils/logger')
const log = logger(module.filename)

/*
tra_id: id de la trace (séquence automatique)
tra_date: date de la trace
tra_uti_id: id de l'utilisateur effectuant l'action
tra_action: type de mise à jour : CRUD : Create, Read, Update, Delete
tra_objet: objet concerné
tra_objet_id: id de l'objet
tra_contenu: contenu de l'objet
*/
module.exports = async function (req, res) {

    log.d('postTrace user :',req)
    const params = req
    //log.d('postTrace user :',req.query)
/*
    if(!req.session.user){
        return res.sendStatus(403)
    }
    else
    {
        log.d('postTrace user :',req.session)
    }
*/ 
    
    const tra_uti_id = params.tra_uti_id
    const tra_action = params.tra_action
    const tta_id = params.tta_id
    const tra_objet = params.tra_objet
    const tra_objet_id = params.tra_objet_id
    const tra_contenu = params.tra_contenu

    log.d('postTrace tra_uti_id :',tra_uti_id)
/*
    tra_uti_id 
    tra_action 
    tra_objet 
    tra_objet_id 
    tra_contenu 
*/
    /*
    const params = {
    tra_action : 'C',
    tta_type_id: 1,
    tra_objet: 'UTILISATEUR',
    tra_objet_id: user.id,
    tra_contenu: user
    }*/
    

    /*
    			tra_id 		SERIAL not null,
			tra_uti_id  BIGINT not null,
			tra_date	timestamp not null,
			tra_action  CHAR(1) not null,
			tra_objet   VARCHAR(30) not null,
			tra_objet_id  BIGINT not null,
			tra_contenu JSON,
    */
        var detailstructure = null
    log.i('::post - In',req)
        const requete = `insert into trace 
                        (tra_uti_id, 
                            tra_date,
                            tra_action,
                            tta_id,
                            tra_objet, 
                            tra_objet_id, 
                            tra_contenu )
                        values($1,now(),$2,$3,$4,$5,$6 ) RETURNING *`;

        await pgPool.query(requete, [
            tra_uti_id,
            tra_action ,
            tta_id,
            tra_objet ,
            tra_objet_id ,
            tra_contenu ],(err, result) => {
        if (err) {
            log.w('::post - Erreur lors de la création.', { requete , erreur: err.stack})                
            return res.status(400).json('erreur lors de la création de la trace');
        }
        else {
            log.i('::post',result)
            //detailstructure = result.rows[0];
            //log.i("Id du détail de la structure : ", detailstructure.dco_id)
            return result.rows[0].tra_id
        }
        })


    log.i('::post - Done')
}
