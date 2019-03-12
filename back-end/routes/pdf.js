const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    var fileName = `/tmp/${id}.pdf`; // The default name the browser will use
    
    res.download(fileName);  
    console.log('telechargement de',fileName)  
})

module.exports = router;