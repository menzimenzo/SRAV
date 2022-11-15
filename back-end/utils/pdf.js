const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');
const { lineGap } = require('pdfkit');
const log = logger(module.filename)
const pgPool = require('../pgpool').getPool();

function generate(id,nbenfants,dateintervention, ustid,strcorealisatrice,strcorealisatriceautre) {
   var nbzero;
   var idformate = "";
    // Récupération du logo s'il y en a un 
    pgPool.query(
        `SELECT encode(stl_document, 'base64') as image, str_logo_proportion as proportion, str_logo_pos_vertical as y_pos, str_logo_pos_horizontal as x_pos 
                FROM structure_logo stl
                INNER JOIN structure str on str.str_id = stl.str_id and str.str_partenaire_titre = true
                INNER JOIN uti_str ust on ust.str_id = str.str_id and ust.ust_id = $1`, [ustid],
    function (err, results) 
    {
        if (err) {
            log.w('::get - erreur',err);
        } 
        else 
        {
            pgPool.query(
                `SELECT str_libellecourt  
                        FROM structure 
                        WHERE str_id = $1`, [strcorealisatrice],
            function (err, resultsstr) 
            {
                if (err) {
                    log.w('::get - erreur',err);
                } 
                else {
                    idformate = id.toString();
                    for (nbzero=0;nbzero<7-id.toString().length;nbzero++){
                        idformate = "0" + idformate;
                    }

                    var doc = new PDFDocument({
                        size: 'A4',
                        'dpi':400,
                        
                        layout: 'landscape', // default is portrait
                        margins: {
                            bottom: 0,
                        }
                    });
                                // Pipe its output somewhere, like to a file or HTTP response
                    // See below for browser usage
                    doc.pipe(fs.createWriteStream(`${config.pathAttestation}${idformate}.pdf`));    
                
                    var indexpage;
                    for (indexpage = 1; indexpage <= nbenfants; indexpage++) {
                        doc.image("./assets/FondSavoirRouler.png", 0,0, {
                            cover: [841.89 , 595.28],
                            layout : 'landscape'
                        });
                
                        var numattestation = "";
                        var nbzero;
                        var dateaffichee = ""
                    
                        // Formatage du numéro correspondant à chaque page
                        var indexpageformate = indexpage.toString();
                        for (nbzero=0;nbzero<4-indexpage.toString().length;nbzero++){
                            indexpageformate = "0" + indexpageformate;
                        }
                        // Formatage final du numéro d'intervention
                        numattestation = idformate + indexpageformate;
                        // Formatage de la date
                        dateaffichee = dateintervention.substr(8,2)+"/"+dateintervention.substr(5,2)+"/"+dateintervention.substr(0,4);
                        doc.fontSize(14);
                        doc.text(numattestation,630,352.5,{align:'left'});
                        doc.text(dateaffichee,555,422.5,{align:'left'});

                        // Logo du partenaire titre s'il est coché
                        if (results.rows.length != 0) {
                            var fileContents = results.rows[0].image
                            doc.image(new Buffer.from(fileContents, 'base64'), results.rows[0].x_pos,results.rows[0].y_pos, {
                                scale: results.rows[0].proportion/100
                            });        
                        }
                        // Co-Réalisation 
                        if (resultsstr.rows.length != 0) 
                            doc.text("Co-réalisé avec le partenaire «"+resultsstr.rows[0].str_libellecourt+"»",350,517,{align:'right', width:430});
                        else
                        if (strcorealisatriceautre)
                            doc.text("Co-réalisé avec «"+strcorealisatriceautre+"»",350,517,{align:'right', width:430});

                        // dernière page ? pour ne pas ajouter de page vide
                        if (indexpage <= nbenfants-1) {
                            doc.addPage();
                        }
                    }
                    // Finalize PDF file
                    log.i('::get - Done, fin de la transaction documents');

                    doc.end();
                    return id;       
                }
            });       
        }
    });            

};

module.exports.generate = generate





