var express = require('express');
var connection = require('../connection');

var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    connection.get().query('SELECT * FROM user', function(err, rows) {
        if(err) {
            throw err;
        }
        console.log(rows[0]);
    });

    res.render('index', { title: 'Home' });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
}

module.exports = router;