const pgPool = require('../pgpool').getPool()

const logger = require('../utils/logger')
const log = logger(module.filename)

module.exports = async function (req, res) {
    const mastructure= req[0]
    var dco_id = null
    var detailstructure = null
    log.i('::post - In', {mastructure })
    if (mastructure.str_id == 99999) {
        const requete = `insert into detail_collectivite 
                        (tco_id, dco_codepostal, dco_insee, dco_dep,dco_epci_code)
                        values($1,$2,$3,$4,$5 ) RETURNING *`;

        //console.log({ requete });
        pgPool.query(requete, [tco_id, dco_codepostal, dco_insee, dco_dep,dco_epci_code],(err, result) => {
        if (err) {
            log.w('::post - Erreur lors de la création.', { requete , erreur: err.stack})                
            return res.status(400).json('erreur lors de la création du détail de ma structure');
        }
        else {
            log.i('::post - insert detail structure')
            detailstructure = result.rows[0];
            log.i("Id du détail de la structure : ", detailstructure.dco_id)
            return detailstructure.dco_id
        }
        })

    } else
    {
        return null;
    }
    log.i('::post - Done')
}
