const express    = require('express');
const router     = express.Router();
const config     = require('../config');
const stream = require('stream');
let   upload     = require('../utils/multer.config.js')
const pgPool = require('../pgpool').getPool();

router.get('/', function (req, res, next) {
    console.log('Getting documents');

    pgPool.query(
        'SELECT * FROM document',
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log('Fin de la transaction documents', result.length);
                return res.send(result.rows);
            }
        });
})

router.get('/:docId', function (req, res, next) {
    console.log('Getting documents');

    pgPool.query(
        'SELECT * FROM document WHERE doc_id = $1', [req.params.docId],
        function (err, results) {
            if (err || results.rows.length == 0) {
                console.log(err);
            } else {
                console.log('Fin de la transaction documents');
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
    console.log('Deleting document');

    pgPool.query(
        'DELETE FROM document WHERE doc_id = $1', [req.params.docId],
        function (err, results) {
            if (err) {
                console.log(err);
                return res.sendStatus(500)
            } else {
                return res.send('OK')
            }
        });
})

router.post('/', upload.single("file"), (req, res) => {

    const requete = `insert into document 
    (doc_type, doc_filename, doc_libelle, doc_contenu) 
    values('${req.file.mimetype}','${req.file.originalname}','${req.body.libelle}',$1)`;
    console.log(requete)
    return pgPool.query(requete, [req.file.buffer], (err, result) => {
        if (err) {
            console.log(err.stack);
            return res.status(400).json('erreur lors de la sauvegarde du fichier');
        }
        else {
            console.log({ result, rows: result.rows });
            return res.status(200).json({ fichier: result.rows[0] });
        }
    })
})

module.exports = router;