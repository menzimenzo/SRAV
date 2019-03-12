const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generate(id) {
    
var doc = new PDFDocument({
        size: 'legal',
        layout: 'landscape' // default is portrait
      });

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream("../tmp/" + id + ".pdf"));

    doc.image("./assets/FondSavoirRouler.png", {
        fit: [950, 528],
        align: 'center',
        valign: 'center',
        layout : 'landscape'
    });
    doc.text(id,600,400,{align:'center'})
    // Finalize PDF file
    doc.end();
    return id;
};

module.exports.generate = generate





