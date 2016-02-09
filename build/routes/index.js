var express = require('express');
var connection = require('../connection');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    connection.connect();
    connection.query('SELECT * FROM user', function(err, rows) {
        if(err) {
            throw err;
        }
        console.log('Database connection established');
        console.log(rows[0]);
    });
    connection.end();

    res.render('index', { title: 'Express' });
});

module.exports = router;