var express = require('express');

var connection = require('../connection');
var passport = require('passport');
var bcrypt = require('bcrypt');

var router = express.Router();

// render the login page when the user goes to index/root
router.get('/', function(req, res, next) {
    res.render('login', {
        'title': 'Login'
    });
});

// authenticate the login, if successful redirect to the users page
router.post('/', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Invalid username or password'
}), function(req, res) {
    console.log('Authentication successful');
    req.flash('success', 'You are logged in');
    res.redirect('/users/');
});

// after the user has clicked the register button, check if the token generated is valid.
// if valid go to the activate page
router.get('/activate/:token', function(req, res, next) {
    if(req.params.token.length != 16) {
        res.redirect('/');
    }

    connection.get().query('SELECT * FROM tokens WHERE token = ?', req.params.token, function(err, rows) {
        if(err) {
            throw err;
        }

        res.render('activate', {
            title: 'Activate',
            row: rows[0]
        });
    });
});

// when the activate form is submitted make sure the new passwords match.
// then insert the password into the users table where the generated token match.
// then delete the token from the tokens table.
// lastly redirect to the login page.
router.post('/activate/:token', function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }

    // store form variables
    var password = req.body.password;
    var passwordVerify = req.body.passwordVerify;

    req.checkBody('password', "Passwords must match").equals(passwordVerify);

    var errors = req.validationErrors();
    if(errors) {
        res.render('activate', {
            title: 'Activate',
            errors: errors,
            row: {
                token: req.params.token
            }
        });
    }
    else {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                throw err;
            }

            // set hashed password
            var hashedPassword = hash;

            // construct query string
            var query = 'UPDATE users ' +
                'INNER JOIN tokens ON users.t_number = tokens.t_number ' +
                'SET users.password = \'' + hashedPassword + '\' ' +
                'WHERE tokens.token = \'' + req.params.token + '\'';

            connection.get().query(query, function (err, rows) {
                if (err) {
                    throw err;
                }

                console.log('Updated user password');
            });

            connection.get().query('DELETE FROM tokens WHERE token = ?', req.params.token, function (err, rows) {
                if (err) {
                    throw err;
                }

                console.log('Token record removed');
            });

            res.location('/');
            res.redirect('/');
        });
    }
});

module.exports = router;