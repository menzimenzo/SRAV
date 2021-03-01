const express    = require('express');
const router     = express.Router();
const config     = require('../config');
const stream = require('stream');
let   upload     = require('../utils/multer.config.js')
const pgPool = require('../pgpool').getPool();

const logger = require('../utils/logger')
const log = logger(module.filename)

router.get('/', function (req, res, next) {
    log.i('::list - In')
    pgPool.query(
        'SELECT * FROM document',
        function (err, result) {
            if (err) {
                log.w('::list - erreur', err);
            } else {
                log.i('::list - Done, fin de la transaction documents', result.length);
                return res.send(result.rows);
            }
        });
})

router.get('/:docId', function (req, res, next) {
    log.i('::get - In', { id: req.params.docId })
    pgPool.query(
        'SELECT * FROM document WHERE doc_id = $1', [req.params.docId],
        function (err, results) {
            if (err || results.rows.length == 0) {
                log.w('::get - erreur',err);
            } else {
                log.i('::get - Done, fin de la transaction documents');
                var file = results.rows[0]
                var fileContents = Buffer.from(file.doc_contenu, "base64");
                var readStream = new stream.PassThrough();
                readStream.end(fileContents);
                
                res.set('Content-disposition', 'attachment; filename=' + file.doc_libelle);
                res.set('Content-Type', file.doc_type);
                
                return readStream.pipe(res);
            }
        });
})

router.delete('/:docId', function (req, res, next) {
    log.i('::delete - In', { id: req.params.docId});
    pgPool.query(
        'DELETE FROM document WHERE doc_id = $1', [req.params.docId],
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

router.post('/', upload.single("file"), (req, res) => {
    log.i('::post - In')
    const requete = `insert into document 
    (doc_type, doc_filename, doc_libelle, doc_contenu) 
    values($1,$2,$3,$4)`;
    return pgPool.query(requete, [req.file.mimetype,req.file.originalname,req.body.libelle,req.file.buffer], (err, result) => {
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