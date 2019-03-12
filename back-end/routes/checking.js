const express = require('express');
const router = express.Router();
const pgPool = require('../pgpool').getPool();

router.get('/',

    function (req, res) {
        console.log('Avant query');
        pgPool.query(
            'INSERT into checking (chk_id) VALUES($1)',
            [31],
            function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('ligne inseree avec id: ');
                }
            });
        res.send("done");
        console.log('Fin de la transaction');
    });

/*
       sess = req.session;
   
       if(sess.pseudo){
           //res.sendFile('/checking', {root: __dirname});
           res.redirect('/checking');
       } else {
           res.redirect('/intevention');
       }
*/

module.exports = router;