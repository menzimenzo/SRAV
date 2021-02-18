const express = require('express');
const router = express.Router();
const config = require('../config');
const bodyParser = require('body-parser');
const pgPool = require('../pgpool').getPool();

const logger = require('../utils/logger')
const log = logger(module.filename)

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


router.get('/', async function (req, res) {
    res.send("done root");
});

router.get('/pdf/:id', async function (req, res) {
    const id = req.params.id
    log.i('::pdf - In', { id })
    var doc = new PDFDocument({
        size: 'legal',
        layout: 'landscape' // default is portrait
      });

      

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream("../tmp/" + id + ".pdf"));
    /* 
    // Embed a font, set the font size, and render some text
    doc.font('fonts/PalatinoBold.ttf')
       .fontSize(25)
       .text('Some text with an embedded font!', 100, 100);
     */
    // Add an image, constrain it to a given size, and center it vertically and horizontally


    //savoirrouleravelo_p.png

    
    /*
    doc.addPage({
        size: 'LEGAL',
        layout: 'landscape',
    });
*/
    doc.image("./assets/FondSavoirRouler.png", {
        fit: [950, 528],
        align: 'center',
        valign: 'center',
        layout : 'landscape'
    });
    doc.text('097645678',600,400,{align:'center'})
/*
    // Add another page
    doc.addPage()
        .fontSize(25)
        .text('Here is some vector graphics...', 100, 100);

    // Draw a triangle
    doc.save()
        .moveTo(100, 150)
        .lineTo(100, 250)
        .lineTo(200, 250)
        .fill("#FF3300");

    // Apply some transforms and render an SVG path with the 'even-odd' fill rule
    doc.scale(0.6)
        .translate(470, -380)
        .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
        .fill('red', 'even-odd')
        .restore();

    // Add some text with annotations
    doc.addPage()
        .fillColor("blue")
        .text('Here is a link!', 100, 100)
        .underline(100, 100, 160, 27, { color: "#0000FF" })
        .link(100, 100, 160, 27, 'http://google.com/');
*/
    // Finalize PDF file
    doc.end();



/*


    client.connect();

    fs.readFile("../temp/output.pdf", (err, imgData) => {
        const requete = `INSERT INTO CHECKING (CHK_DOCUMENT,CHK_DATE) VALUES ('` + imgData + `',now())`;


        console.log(requete)

        client.query(requete, (err, result) => {
            if (err) {
                console.log(err.stack);
                client.end();
                return res.status(400).json('erreur lors de l\'insertion du document');
            }
            else {
                client.end();
                //const interventions = result.rows;
                res.send('Le document a été uploadé');
            }
        });

    })
*/
log.d('::pdf - document prêt:', { doc })

res.json({ message: 'Le document a été uploadé'});
    /*
        const id = req.params.id;
    
        const client = new Client({
            user: config.postgres.user,
            host: config.postgres.host,
            database: config.postgres.database,
            password: config.postgres.password,
            port: config.postgres.port,
        })
    
        client.connect();
    
        const requete ='SELECT * from intervention where int_id='+id;
        console.log(requete)
    
        client.query(requete, (err, result) => {
            if (err) {
                console.log(err.stack);
                client.end();
                return res.status(400).json('erreur lors de la récupération de l\'intervention');
            }
            else {
                client.end();
                const interventions = result.rows;
                //res.json({ interventions });
            }
        });
    */

});
/*
router.get('/', async function (req, res) {
    const client = new Client({
        user: config.postgres.user,
        host: config.postgres.host,
        database: config.postgres.database,
        password: config.postgres.password,
        port: config.postgres.port,
    })

    client.connect();

    client.query('SELECT * from attestation', (err, result) => {
        if (err) {
            console.log(err.stack);
            client.end();
            return res.status(400).json('erreur lors de la récupération des interventions');
        }
        else {
            client.end();
            const attestations = result.rows;
            res.json({ attestations });
        }
    })
});
*/


router.post('/', function (req, res) {
    log.i('::post - In')
    const nbEnfants = req.body.params.nbenfants
    var nbGarcons = req.body.params.nbgarcons
    var nbFilles = req.body.params.nbfilles
    const commune = req.body.params.commune
    const cai = req.body.params.cai
    const blo_id = req.body.params.blod_id
    const dateintervention = req.body.params.dateintervention
    const commentaire = req.body.params.commentaire
    const codepostal = req.body.params.cp;
    const siteintervention = req.body.params.siteintervention;

    if (nbGarcons == '') { nbGarcons = null }
    if (nbFilles == '') { nbFilles = null }

    const now = new Date()
    const datecreation = now.getFullYear() + "-" + eval(now.getMonth() + 1) + "-" + now.getDate()

    //insert dans la table intervention
    const requete = `insert into intervention 
                    (cai_id,blo_id,int_com_codeinsee,int_com_codepostal,int_com_libelle,int_nombreenfant,int_nombregarcon,int_nombrefille,int_dateintervention,int_datecreation,int_commentaire,int_dep_num,int_reg_num,int_siteintervention) 
                    values(` + cai + `,` + blo_id + `,` + commune.cpi_codeinsee + `,` + codepostal + `,'` + commune.com_libellemaj + `',` + nbEnfants + `,` + nbGarcons + `,` + nbFilles + `,'` + dateintervention + `','` + datecreation + `','` + commentaire + `',` + commune.dep_num + `,94,'` + siteintervention + `')`
    log.d('::post - requete', { requete })
    pgPool.query(requete, (err, result) => {
        if (err) {
            log.w(err.stack)
            return res.status(400).json('erreur lors de la sauvegarde de l\'intervention')
        }
        else {
            log.i('::post - Done')
            return res.status(200).json('OK')
        }
    })
})


module.exports = router;