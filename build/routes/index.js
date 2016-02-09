var express = require('express');
var connection = require('../connection');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    connection.get().query('SELECT * FROM user', function(err, rows) {
        if(err) {
            throw err;
        }
        console.log(rows[0]);
    });

    res.render('index', { title: 'Home' });
});

module.exports = router;