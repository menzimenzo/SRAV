const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const config = require('../config');

function generate(id,nbenfants,dateintervention) {
   var nbzero;
   var idformate = "";
   idformate = id.toString();
   for (nbzero=0;nbzero<7-id.toString().length;nbzero++){
       idformate = "0" + idformate;
   }
    var doc = new PDFDocument({
        size: 'A4',
        'dpi':400,
        layout: 'landscape' // default is portrait
      });

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    //doc.pipe(fs.createWriteStream("../tmp/" + idformate + ".pdf"));
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
        doc.text(numattestation,577,352.5,{align:'center'});
        doc.text(dateaffichee,409,422,{align:'center'});
        // dernière page ? pour ne pas ajouter de page vide
        if (indexpage <= nbenfants-1) {
            doc.addPage();
        }
    }
    // Finalize PDF file
    doc.end();
    return id;
};

module.exports.generate = generate





