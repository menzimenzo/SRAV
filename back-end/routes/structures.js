const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

const logger = require('../utils/logger')
const {formatStructure} = require('../utils/utils')
const log = logger(module.filename)

// Route pour récupérer les structures d'un utilisateur

let byUserHandler = async function (req, res) {

    const userId = req.params.id
    const statuts = req.params.statuts
    const user = req.session.user

    // traduction du parametre statuts
    let statutList = []
    if (statuts == null || statuts === "ACTUELLES") {
        statutList.push(1) // actif
    } else if (statuts === "PASSEES") {
        statutList.push(0) // inactif
        statutList.push(2) // bloqué
    } else if (statuts === "ALL") {
        statutList.push(0) // inactif
        statutList.push(1) // actif
        statutList.push(2) // bloqué
    }

    var requete = null
    log.i('::get - /user/In', { userId })

    requete = `SELECT *
                    FROM uti_str ust 
                    LEFT JOIN detail_collectivite dco on dco.dco_id = ust.dco_id
                    LEFT JOIN type_collectivite tco on tco.tco_id = dco.tco_id
                    LEFT JOIN departement dep on dco.dco_dep = dep.dep_num and dco.tco_id = 2
                    LEFT JOIN commune com on dco.dco_insee = com.cpi_codeinsee and dco.tco_id = 1
                    LEFT JOIN EPCI epc on dco.dco_insee = epc.com_codeinsee and dco.tco_id = 3
                    LEFT JOIN etablissement eta on eta.eta_uai = ust.uti_structurelocale and ust.str_id = 9
                    INNER JOIN structure str on str.str_id= ust.str_id `;



    /* Pour un profil Admin on récupère toutes les structures */
    // Donc on ne fait rien
    /* Pour un profil partenaire on ne récupère que ses structures actives */
    if(user.pro_id == 2) {
        requete += ` WHERE ust.sus_id in (${statutList}) `
        requete += ` and ust.str_id in (select ustd.str_id from uti_str ustd where ustd.uti_id = ${userId}) `
    }

    /* Pour un profil Intervenant on ne récupère que ses structures actives */
    if(user.pro_id == 3) {
        requete += ` WHERE ust.sus_id in (${statutList}) `
        requete += ` and ust.uti_id=${userId} `
    }
    requete = requete + `order by str.str_libelle, ust.uti_structurelocale `;

    log.d('::get - /user/In', { requete })

    return pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::get - Erreur lors de la requete', { userId, requete, erreur: err.stack })
            return res.status(400).json({message: 'erreur lors de la récupération des structures du user'});
        }
        else {
            const structures = result.rows;
            if (!structures) {
                log.w('::get - aucune structure')
                return res.status(200).json({ structures: [] });
            }
            //log.w('::get - ',{ structures })
            log.i('::get - /user/Done')
            return res.status(200).json({ structures })
        }
    })
}

router.get('/user/:id', byUserHandler)
router.get('/user/:id/:statuts', byUserHandler)

router.get('/typecollectivite/', async function (req, res) {

    log.i('::get - /typecollectivite/In')
    const requete = `SELECT *
                    FROM type_collectivite
                    order by tco_libelle`;
    log.d('::get - /typecollectivite/In', { requete })

    return pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::get - Erreur lors de la requete', { userId, requete, erreur: err.stack })
            return res.status(400).json({message: 'erreur lors de la récupération des structures du user'});
        }
        else {
            const typeCollectivite = result.rows;
            if (!typeCollectivite) {
                log.w('::get - aucun type de collectivite trouvé')
                return res.status(200).json({ structtypeCollectiviteures: [] });
            }
            log.w('::get - ',{ typeCollectivite })
            log.i('::get - /typecollectivite/Done')
            return res.status(200).json({ typeCollectivite })
        }
    })
})

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    log.i('::get - In', { id })
    const requete = `SELECT * from Structure where str_id=${id}`;
    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::get - Erreur lors de la requete', { id, requete, erreur: err.stack })
            return res.status(400).json('erreur lors de la récupération de la structure');
        }
        else {
            const structures = result.rows[0];
            if (!structures) {
                log.w('::get - Structure inexistante')
                return res.status(400).json({ message: 'Structure inexistante' });
            }
            log.i('::get - Done')
            return res.status(200).json({ structures });
        }
    })
});

router.get('/', function (req, res) {
    log.i('::list - In')
    // La méthode get est appelée sans paramètre : On retourne la liste
    var requete = ""
    const user = req.session.user

    requete = `SELECT *, replace(replace(str_actif::text,'true','Oui'),'false','Non') as str_actif_on, replace(replace(str_federation::text,'true','Oui'),'false','Non') as str_federation_on 
    FROM structure`
    //left join type_collectivite tco on structure.str_id = 99999
    /* Pour un profil référent on supprime tout ce qui est relatif aux écoles */
    if(user.pro_id == 4){
        requete += ` where str_id <> 9`
    }
    requete += ` order by str_libellecourt`
    log.d(requete)
    pgPool.query(
        requete,
        function (err, result) {
            if (err) {
                log.w('::list - Erreur lors de la requete', { requete, erreur: err.stack })
            } else {
                log.i('::list - Fin de la transaction structures (sans paramètres)', result.length);
                return res.send(result.rows);
            }
        });


});

router.put('/:id', async function (req, res) {
    const structure = req.body.structureSelectionnee    
    const id = req.params.id
    log.i('::update - In', { id })
    let { str_libelle, str_libellecourt, str_actif,str_federation } = structure

    //insert dans la table intervention
    const requete = `UPDATE structure 
        SET str_libelle = $1,
        str_libellecourt = $2,
        str_actif = $3,
        str_federation = $4
        WHERE str_id = ${id}
        RETURNING *
        ;`    
    pgPool.query(requete,[str_libelle,
        str_libellecourt,
        str_actif,
        str_federation], (err, result) => {
        if (err) {
            log.w('::update - Erreur lors de la mise à jour', { requete , erreur: err.stack})
            return res.status(400).json('erreur lors de la sauvegarde de la structure');
        }
        else {
            log.i('::update - Done')
            return res.status(200).json({ structure: (result.rows[0])});
        }
    })
})


router.post('/desactiveuser/', function (req, res) {
    log.i('::post desactiveuser - In')
    //const structure = req.body.structure
    const mastructure = req.body.mastructure
    //console.log(mastructure)
    var param3, requete
    let { utilisateurId,str_id, dco_id, uti_structurelocale } = mastructure
    // Création du détail de la collectivité si c'est une collectivité
    // Retour de la promesse
    log.d("uti_structurelocale",uti_structurelocale)
    
    log.d("dco_id",dco_id)
    if (!uti_structurelocale) {
        param3 = dco_id
        requete = `update uti_str set sus_id = 0
                        where uti_id = $1 and str_id = $2 and dco_id = $3
                        RETURNING *`;
    }
    else
    {
        param3 = uti_structurelocale
        requete = `update uti_str set sus_id = 0
        where uti_id = $1 and str_id = $2 and uti_structurelocale = $3
        RETURNING *`;        
    }
    log.d("param",utilisateurId, str_id, dco_id)
    log.d("requete",requete)
    pgPool.query(requete, [utilisateurId, str_id, param3],(err, result) => {
        if (err) {
            log.w('::post desactiveuser- Erreur lors de la suppression.', { requete , erreur: err.stack})                
            return res.status(400).json('erreur lors de la suppression de la structure de l\'utilisateur');
        }
        else {
            log.i('::post desactiveuser- Done')
            return res.status(200).json({ structure: (result.rows[0]) });
        }
    });
})


router.post('/activeuser/', function (req, res) {
    log.i('::post activeuser - In')
    //const structure = req.body.structure
    const mastructure = req.body.mastructure
    //console.log(mastructure)
    var param3, requete
    let { utilisateurId,str_id, dco_id, uti_structurelocale } = mastructure
    // Création du détail de la collectivité si c'est une collectivité
    // Retour de la promesse
    log.d("uti_structurelocale",uti_structurelocale)

    log.d("dco_id",dco_id)
    if (!uti_structurelocale) {
        param3 = dco_id
        requete = `UPDATE uti_str SET sus_id = 1
                        WHERE uti_id = $1 AND str_id = $2 AND dco_id = $3 
                        RETURNING *`;
    }
    else
    {
        param3 = uti_structurelocale
        requete = `UPDATE uti_str SET sus_id = 1
        WHERE uti_id = $1 AND str_id = $2 AND uti_structurelocale = $3
        RETURNING *`;
    }
    log.d("param",utilisateurId, str_id, dco_id)
    log.d("requete",requete)
    pgPool.query(requete, [utilisateurId, str_id, param3],(err, result) => {
        if (err) {
            log.w('::post activeuser- Erreur lors de la suppression.', { requete , erreur: err.stack})
            return res.status(400).json('erreur lors de l\'association de la structure à l\'utilisateur');
        }
        else {
            log.i('::post activeuser- Done')
            return res.status(200).json({ structure: (result.rows[0]) });
        }
    });
})


router.post('/user/', function (req, res) {
    log.i('::post - In')
    //const structure = req.body.structure
    const mastructure = req.body.mastructure
    console.log(mastructure)
     
    let { utilisateurId,str_id, uti_structurelocale, dco_codepostal, dco_insee, dco_dep, dco_epci_code, tco_id } = mastructure
    // Création du détail de la collectivité si c'est une collectivité
    putDetailCollectivite(mastructure).then(result => {
        // Retour de la promesse
        log.d("Id du détail collectivité : ", result);
        var dco_id = result
        const requete = `insert into uti_str 
                        (uti_id, str_id,dco_id, uti_structurelocale, sus_id)
                        values($1,$2,$3,$4,1 ) RETURNING *`;
        log.d("utilisateurId",utilisateurId)
        log.d("dco_id",dco_id)
        log.d("str_id",str_id )
        log.d("uti_structurelocale",uti_structurelocale)
        pgPool.query(requete, [utilisateurId, str_id,dco_id, uti_structurelocale],(err, result) => {
            if (err) {
                log.w('::post - Erreur lors de la création.', { requete , erreur: err.stack})                
                return res.status(400).json('erreur lors de la création de la structure de l\'utilisateur');
            }
            else {
                log.i('::post - Done')
                return res.status(200).json({ structure: (result.rows[0]) });
            }
        });
    })
    .catch(err => {
        return err
    });
})

async function putDetailCollectivite(mastructure) {
    return new Promise( (resolve, reject) => {
        log.i("::putDetailCollectivite - In")
        // Cas de la structure de type collectivité
        if (mastructure.str_id == 99999) { 
            const requete = `insert into detail_collectivite 
            (tco_id, dco_codepostal, dco_insee, dco_dep,dco_epci_code)
            values($1,$2,$3,$4,$5 ) RETURNING *`
            log.d('::putDetailCollectivite - requete', { requete })
            pgPool.query(requete, [mastructure.tco_id, mastructure.dco_codepostal, mastructure.dco_insee, mastructure.dco_dep,mastructure.dco_epci_code], (err, result) => {
                if (err) {
                    log.w(err.stack)
                    reject('erreur lors de la sauvegarde de l\'intervention')
                }
                else {
                    var resultat = result.rows[0].dco_id
                    log.i('::putDetailCollectivite - Done',resultat) 
                    resolve(resultat)
                }
            })
        }
        else
            // Ce n'est pas une structure de type collectivité, on renvoie null
            resolve(null)
    // Fin de la Promesse
    })
}


router.post('/', function (req, res) {
    log.i('::post - In')
    const structure = req.body.structure
    console.log(structure)
    
    let { str_libelle,  str_libellecourt, str_actif, str_federation,str_typecollectivite } = structure


    if (str_actif == '') { str_actif = false } else { str_actif = true}
    if (str_federation == '') { str_federation = false } else { str_federation = true}
    if ( ! str_typecollectivite ) { str_typecollectivite = null } 
    //insert dans la table structure
    const requete = `insert into structure 
                    (str_libelle,  str_libellecourt, str_actif, str_federation,str_typecollectivite)
                    values($1,$2,$3,$4,$5 ) RETURNING *`;
    
    //console.log({ requete });
    pgPool.query(requete, [str_libelle,  str_libellecourt, str_actif, str_federation,str_typecollectivite],(err, result) => {
        if (err) {
            log.w('::update - Erreur lors de la création.', { requete , erreur: err.stack})                
            return res.status(400).json('erreur lors de la création de la structure');
        }
        else {
            log.i('::post - Done')
            return res.status(200).json({ structure: (result.rows[0]) });
        }
    })
})

module.exports = router;