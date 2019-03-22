const express    = require('express');
const router     = express.Router();
const bodyParser = require('body-parser');
const config     = require('../config');
let   upload     = require('../utils/multer.config.js')
const pgPool = require('../pgpool').getPool();

router.get('/:id', function (req, res, next) {
    const id        = req.params.id;
    var   idformate = id.toString();
    for (nbzero=0;nbzero<7-id.toString().length;nbzero++){
        idformate = "0" + idformate;
    }
    //var fileName = `../../tmp/${idformate}.pdf`; // The default name the browser will use
    var fileName = `${config.pathAttestation}${idformate}.pdf`;  // The default name the browser will use

    
    return res.download(fileName);  
    console.log('telechargement de',fileName)  
})


module.exports = router;