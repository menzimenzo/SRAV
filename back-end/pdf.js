const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generate(id,nbenfants) {

        // Formatage de l'id pour passer sur 7 caractères
   var nbzero;
   var idformate = "";
   idformate = id.toString();
   for (nbzero=0;nbzero<7-id.toString().length;nbzero++){
       idformate = "0" + idformate;
       console.log(idformate);
   }
    var doc = new PDFDocument({
        size: 'legal',
        layout: 'landscape' // default is portrait
      });

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream("../tmp/" + idformate + ".pdf"));
    
    var indexpage;
    for (indexpage = 1; indexpage <= nbenfants; indexpage++) {
        doc.image("./assets/FondSavoirRouler.png", 75,5,{
            //fit: [950, 528],
            width: 850,
            align: 'center',
            valign: 'center',
            layout : 'landscape'
        });
        var numattestation = "";
        var nbzero;

        // Formatage du numéro correspondant à chaque page
        var indexpageformate = indexpage.toString();
        for (nbzero=0;nbzero<4-indexpage.toString().length;nbzero++){
            indexpageformate = "0" + indexpageformate;
            console.log(indexpageformate);
        }
        // Formatage final du numéro d'intervention
        numattestation = idformate + indexpageformate;
        doc.fontSize(14);
        doc.text(numattestation,390,390,{align:'center'});
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





