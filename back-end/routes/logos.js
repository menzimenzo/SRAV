const express    = require('express');
const router     = express.Router();
const config     = require('../config');
const stream = require('stream');
let   upload     = require('../utils/multer.config.js')
const pgPool = require('../pgpool').getPool();

const logger = require('../utils/logger')
const log = logger(module.filename)


router.get('/:strid', function (req, res, next) {
    log.i('::get - In', { id: req.params.strid })
    pgPool.query(
        'SELECT * FROM structure_logo WHERE str_id = $1', [req.params.strid],
        function (err, results) {
            if (err || results.rows.length == 0) {
                log.w('::get - erreur',err);
            } else {
                log.i('::get - Done, fin de la transaction documents');
                var file = results.rows[0]
                var fileContents = Buffer.from(file.stl_document, "base64");
                var readStream = new stream.PassThrough();
                readStream.end(fileContents);
                
                res.set('Content-disposition', 'attachment; filename=' + "Logo"); 
                res.set('Content-Type', "image/jpeg"); 
                
                return readStream.pipe(res);
            }
        });
})

router.delete('/:strid', function (req, res, next) {
    log.i('::delete - In', { id: req.params.strid});
    pgPool.query(
        'DELETE FROM structure_logo WHERE str_id = $1', [req.params.strid],
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

router.put('/', upload.single("file"), (req, res) => {
    log.i('::put - In')
    const requete = `update structure_logo set STL_DOCUMENT=$2 where STR_ID = $1`;
    return pgPool.query(requete, [req.body.strid,req.file.buffer], (err, result) => {
        if (err) {
            log.w('::put - Erreur',{ requete, erreur: err.stack});
            return res.status(400).json('erreur lors de la sauvegarde du fichier');
        }
        else {
            log.i('::put - Done', { rows: result.rows })
            return res.status(200).json({ fichier: result.rows[0] });
        }
    })
})


router.post('/', upload.single("file"), (req, res) => {
    log.i('::post - In')
    const requete = `insert into structure_logo 
    (STR_ID, STL_DOCUMENT) 
    values($1,$2)`;
    return pgPool.query(requete, [req.body.strid,req.file.buffer], (err, result) => {
        if (err) {
            log.w('::post - Erreur',{ requete, erreur: err.stack});
            return res.status(400).json('erreur lors de la sauvegarde du fichier');
        }
        else {
            log.i('::post - Done', { rows: result.rows })
            return res.status(200).json({ fichier: result.rows[0] });
        }
    })
})

module.exports = router;