var express = require('express');

var connection = require('../connection');
var passport = require('passport');

var router = express.Router();
/*Render the login page when the user goes to index/root */
router.get('/', function(req, res, next) {
    res.render('login', {
        'title': 'Login'
    });
});
/*Authenticate the login, if successful redirect to the users page*/
router.post('/', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Invalid username or password'
}), function(req, res) {
    console.log('Authentication successful');
    req.flash('success', 'You are logged in');
    res.redirect('/users/');
});

router.get('/activate/:token', function(req, res, next) {
    connection.get().query('SELECT * FROM tokens WHERE token = ?', req.params.token, function(err, rows) {
        if(err) {
            throw err;
        }

        res.render('activate', {
            title: 'Activate',
            'row': rows[0]
        });
    });
});

router.post('/activate/:token', function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }

    //Store form variables
    var password = req.body.password;
    var passwordVerify = req.body.passwordVerify;

    if(password != passwordVerify) {
        req.flash('error', 'Passwords do not match');
        res.render('activate/' + req.params.token);
    }

    console.log(req.params.token);

    connection.get().query('UPDATE users ' +
                            'INNER JOIN tokens ON users.t_number = tokens.t_number ' +
                            'SET users.password = \'' + password + '\' ' +
                            'WHERE tokens.token = \'' + req.params.token + '\'', function(err, rows) {
        if(err) {
            throw err;
        }

        console.log('Updated user password');
    });

    connection.get().query('DELETE FROM tokens WHERE token = ?', req.params.token, function(err, rows) {
            if(err) {
                throw err;
            }

            console.log('Token record removed');
    });

    res.location('/');
    res.redirect('/');
});

module.exports = router;