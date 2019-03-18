const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

router.get('/',

    function (req, res) {
        console.log('Getting result');
        
        pgPool.query(
            'SELECT * FROM structure',
            function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Fin de la transaction ', result.length);
                    return res.send(result.rows);
                }
            });
        
    });


module.exports = router;