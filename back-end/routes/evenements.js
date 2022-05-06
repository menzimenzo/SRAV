const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();
const config =  require( '../config')
const { sendEmail } = require('../utils/mail-service')
const { formatEvenement } = require('../utils/utils')

const logger = require('../utils/logger');
const log = logger(module.filename)


router.get('/indicateurs/', function (req, res) {
    log.i('::indicateurs - In')    
    const requete = `select eve.eve_id,eve.eve_titre,str.str_libellecourt, count(caisco.cai_id) as scolaire, count(caiperisco.cai_id) as periscolaire, count(caiextrasco.cai_id) as extrascolaire, count(int_id) as total
                    from evenement eve
                    inner join intervention int on int.eve_id = eve.eve_id
                    inner join uti_str ust on ust.ust_id = int.ust_id
                    inner join structure str on str.str_id = ust.str_id
                    left join cadreintervention caisco on caisco.cai_id = 3 and caisco.cai_id = int.cai_id
                    left join cadreintervention caiperisco on caiperisco.cai_id = 1 and caiperisco.cai_id = int.cai_id
                    left join cadreintervention caiextrasco on caiextrasco.cai_id = 2 and caiextrasco.cai_id = int.cai_id
                    group by eve.eve_id,eve.eve_titre,str.str_libellecourt
                    order by eve.eve_id,eve.eve_titre,str.str_libellecourt`

    log.i('::indicateurs - requête', { requete })    
    return pgPool.query(requete,(err, result) => {
        if (err) {
            log.w('::indicateurs - error', err)
            return res.status(400).json({ message: 'erreur sur la requete de recherche des indicateurs événements' });
        }
        else {
            log.i('::indicateurs - Done')    
            const suiviEvenements = result.rows;
            return res.status(200).json({ suiviEvenements });
        }
    });
        
})

/* LISTE DES EVENEMENTS QUI ONT LIEU EN MEME TEMPS QUE LA DATE D'INTEVENTION INDIQUEE */
/**/
router.get('/liste/', function (req, res) {
    var dateintervention
    var ustid
    var blocid
    var caiid
    if(!req.query.ustid){ 
        log.w('::evenements - Paramètres ustid manquant.')
        return res.sendStatus(403) 
    }
    else {
        log.w('::evenements - Paramètres ustid .', req.query.ustid) 
        ustid = req.query.ustid
    }

    if(!req.query.blocid){ 
        log.w('::evenements - Paramètres blocid manquant.')
        return res.sendStatus(403) 
    }
    else {
        log.w('::evenements - Paramètres blocid .', req.query.blocid) 
        blocid = req.query.blocid
    }    
    //const structureId = req.query.str_id
    if(!req.query.dateintervention){ 
        log.w('::evenements - Paramètres dateintervention manquant.')
        return res.sendStatus(403) 
    }
    else {
        dateintervention = req.query.dateintervention
        log.w('::evenements - Paramètres dateintervention .', dateintervention) 
    }  
    if(!req.query.caiid){ 
        log.w('::evenements - Paramètres caiid manquant.')
        return res.sendStatus(403) 
    }
    else {
        log.w('::evenements - Paramètres caiid .', req.query.caiid) 
        caiid = req.query.caiid
    }    

    log.i('::list - In')    
    const requete = `select eve_id ,eve_titre,
            to_char(eve_date_debut, 'DD/MM/YYYY') as eve_date_debut,
            to_char(eve_date_fin, 'DD/MM/YYYY') as eve_date_fin,
            eve_bloc1, eve_bloc2, eve_bloc3, eve_cai_id,
            evs.evs_str_id as str_id
        from evenement eve
        inner join eve_str evs on evs.evs_eve_id = eve.eve_id and eve.eve_toutes_structures = false 
        inner join uti_str ust on ust.str_id = evs.evs_str_id and ust.ust_id = ${ustid}  and ust.str_id <> 99999
        where (eve_date_debut <= '${dateintervention}'::date AND '${dateintervention}'::date <= eve_date_fin)
        and ((1 = ${blocid} and eve.eve_bloc1 = true)
        or (2 = ${blocid} and eve.eve_bloc2 = true)
        or (3 = ${blocid} and eve.eve_bloc3 = true))
        and (eve.eve_cai_id = ${caiid} or eve.eve_cai_id = 0)
        union
        select eve_id ,eve_titre,
            to_char(eve_date_debut, 'DD/MM/YYYY') as eve_date_debut,
            to_char(eve_date_fin, 'DD/MM/YYYY') as eve_date_fin,
            eve_bloc1, eve_bloc2, eve_bloc3, eve_cai_id,
            str.str_id as str_id
        from evenement eve
        inner join structure str on eve.eve_toutes_structures = true  and str_id <> 99999
        inner join uti_str ust on ust.str_id = str.str_id and ust.ust_id = ${ustid}
        where (eve_date_debut <= '${dateintervention}'::date AND '${dateintervention}'::date <= eve_date_fin)
        and ((1 = ${blocid} and eve.eve_bloc1 = true)
        or (2 = ${blocid} and eve.eve_bloc2 = true)
        or (3 = ${blocid} and eve.eve_bloc3 = true))
        and (eve.eve_cai_id = ${caiid} or eve.eve_cai_id = 0)`

    log.i('::list - requête', { requete })    
    return pgPool.query(requete,(err, result) => {
        if (err) {
            log.w('::list - error', err)
            return res.status(400).json({ message: 'erreur sur la requete de recherche de la liste des événements par date d\'intervention' });
        }
        else {
            log.i('::list - Done')    
            const evenements = result.rows;
            return res.status(200).json({ evenements });
        }
    });
        
})

router.get('/:id', async function (req, res) {
    const id = req.params.id;
    log.i('::get - In', { id })
    const requete = `SELECT eve_id ,eve_titre,to_char(eve_date_debut, 'YYYY-MM-DD') as eve_date_debut,to_char(eve_date_fin, 'YYYY-MM-DD') as eve_date_fin , eve_toutes_structures, eve_bloc1,eve_bloc2,eve_bloc3,eve_cai_id   
    FROM evenement WHERE eve_id =${id}`;
    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w('::get - Erreur lors de la requete', { id, requete, erreur: err.stack })
            return res.status(400).json('erreur lors de la récupération de l\'événement');
        }
        else {
            const evenements = result.rows[0];
            if (!evenements) {
                log.w('::get - Evenement inexistante')
                return res.status(400).json({ message: 'Evenement inexistante' });
            }
            log.i('::get - Done')
            return res.status(200).json({ evenements });
        }
    })
});

router.get('/', function (req, res) {
    //const { formateurid, demandeurid, structurerefid } = req.query
    //log.i('::list - In', { formateurid, demandeurid, structurerefid })    
    log.i('::list - In')    

    const requete = `SELECT eve_id ,eve_titre,to_char(eve_date_debut, 'DD/MM/YYYY') as eve_date_debut,to_char(eve_date_fin, 'DD/MM/YYYY') as eve_date_fin , replace(replace(eve_toutes_structures::text,'true','Oui')::text, 'false','Non') as eve_toutes_structures, 
    replace(replace(eve_bloc1::text,'true','Oui')::text, 'false','Non') as eve_bloc1, \
    replace(replace(eve_bloc2::text,'true','Oui')::text, 'false','Non') as eve_bloc2, \
    replace(replace(eve_bloc3::text,'true','Oui')::text, 'false','Non') as eve_bloc3, \
    replace(replace((eve_date_debut <= now()::date AND now()::date <= eve_date_fin )::text,'true','En cours')::text,'false','') || \
    replace(replace((eve_date_debut < now()::date AND eve_date_fin < now()::date)::text,'true','Passé')::text,'false','') || \
    replace(replace((now()::date < eve_date_debut AND now()::date < eve_date_fin )::text,'true','A venir')::text,'false','') Statut, \
    COALESCE(cai.cai_libelle,'Tous') as cai_libelle
    FROM evenement \
    left join cadreintervention cai on cai.cai_id = eve_cai_id \
    order by 1`

    log.i('::list - requête', { requete })    
    return pgPool.query(requete,(err, result) => {
        if (err) {
            log.w('::list - error', err)
            return res.status(400).json({ message: 'erreur sur la requete de recherche demande aaq' });
        }
        else {
            log.i('::list - Done')    
            const evenements = result.rows;
            return res.status(200).json(evenements);
        }
    });
        
})


router.put('/:id', async function (req, res) {
    log.d('::put - Params : ', req.body )
    const evenement = req.body.evenementSelectionnee
    
    let { eve_id,eve_titre, eve_date_debut, eve_date_fin, eve_toutes_structures, eve_bloc1, eve_bloc2, eve_bloc3,eve_cai_id} = evenement

    //insert dans la table intervention
    const requete = `UPDATE evenement
        SET eve_titre = $1,
        eve_date_debut = $2,
        eve_date_fin = $3,
        eve_toutes_structures = $4,
        eve_bloc1 = $5,
        eve_bloc2 = $6,
        eve_bloc3 = $7,
        eve_cai_id = $8
        WHERE eve_id = ${eve_id}
        RETURNING *
        ;`    
    pgPool.query(requete,[eve_titre, eve_date_debut, eve_date_fin, Boolean(eve_toutes_structures), Boolean(eve_bloc1), Boolean(eve_bloc2), Boolean(eve_bloc3) ,eve_cai_id], (err, result) => {
        if (err) {
            log.w('::update - Erreur lors de la mise à jour', { requete , erreur: err.stack})
            return res.status(400).json('erreur lors de la sauvegarde d\'événement');
        }
        else {
            log.i('::update - Done')
            return res.status(200).json({ evenement: (result.rows[0])});
        }
    })
})

router.post('/', async function (req, res) {
    log.d('::post - Params : ', req.body )
    const evenement = req.body.evenement
    
    let { eve_titre, eve_date_debut, eve_date_fin, eve_toutes_structures, eve_bloc1, eve_bloc2, eve_bloc3,eve_cai_id} = evenement
    
    const requete = `INSERT INTO evenement (eve_titre,eve_date_debut,eve_date_fin,eve_toutes_structures,eve_bloc1,eve_bloc2,eve_bloc3,eve_cai_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    log.d('::post - requete', { requete });
    return pgPool.query(requete, [eve_titre, eve_date_debut, eve_date_fin, Boolean(eve_toutes_structures), Boolean(eve_bloc1), Boolean(eve_bloc2), Boolean(eve_bloc3),eve_cai_id ],
        (err, result) => {  
            if (err) {
                log.w('::post - Erreur lors de la requête.', err.stack);
                return res.status(400).json({message: 'erreur lors de la sauvegarde de l\'événement'});
            }
            else {
                log.i('::post - Done', result);
                const evenement = result.rows[0]
                return res.status(200).json({ evenement });
            }
        })
})

router.delete('/:id', function (req, res, next) {
    log.i('::delete - In', { id: req.params.id});
    pgPool.query(
        'DELETE FROM evenement WHERE eve_id = $1', [req.params.id],
        function (err, results) {
            if (err) {
                log.w('::delete - erreur',err);
                return res.sendStatus(500)
            } else {
                log.d('::delete - Done')
                return res.send('OK')
            }
        });
})




module.exports = router;