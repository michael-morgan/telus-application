'use strict';

var express = require('express');

var connection = require('../connection');
var passport = require('passport');
var bcrypt = require('bcryptjs');

var tokenModel = require('../models/token');

var router = express.Router();

// render the login page when the user goes to index/root
router.get('/', function (req, res, next) {
    if (req.user) {
        return res.redirect('/users/');
    }

    res.render('login', {
        title: 'Login',
        messages: req.flash('error'),
        success_message: req.flash('success')
    });
});

// authenticate the login, if successful redirect to the users page
router.post('/', passport.authenticate('local', {
    successRedirect: '/users/',
    failureRedirect: '/',
    failureFlash: true
}));

// after the user has clicked the register button, check if the token generated is valid.
// if valid go to the activate page
router.get('/activate/:token', function (req, res, next) {
    if (req.params.token.length != 16) {
        return res.redirect('/');
    }

    tokenModel.getById([req.params.token], function (err, rows) {
        if (err) {
            throw next(err);
        }
        if (rows.length <= 0) {
            res.redirect('/');
        } else {
            res.render('activate', {
                title: 'Activate',
                row: rows[0]
            });
        }
    });
});

// when the activate form is submitted make sure the new passwords match.
// then insert the password into the users table where the generated token match.
// then delete the token from the tokens table.
// lastly redirect to the login page.
router.post('/activate/:token', function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    if (req.params.token.length != 16) {
        return res.redirect('/');
    }

    // store form variables
    var password = req.body.password;
    var passwordVerify = req.body.passwordVerify;

    req.checkBody('password', "Passwords must match").equals(passwordVerify);

    var errors = req.validationErrors();
    if (errors) {
        res.render('activate', {
            title: 'Activate',
            errors: errors,
            row: {
                token: req.params.token
            }
        });
    } else {
        bcrypt.hash(password, 8, function (err, hash) {
            if (err) {
                throw next(err);
            }

            connection.get().query('UPDATE users ' + 'INNER JOIN tokens ON users.t_number = tokens.t_number' + ' SET users.password = ?' + ' WHERE tokens.token = ?', [hash, req.params.token], function (err, rows) {
                if (err) {
                    req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                    res.render('activate', {
                        title: 'Activate',
                        token: req.params.token,
                        message: req.flash('Our database servers maybe down, please try again') });
                    return;
                }
                console.log('Updated user password');
            });

            tokenModel.deleteById(req.params.token, function (err, rows) {
                if (err) {
                    req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                    res.render('activate', {
                        title: 'Activate',
                        token: req.params.token,
                        message: req.flash('Our database servers maybe down, please try again') });
                    return;
                }
                console.log('Token record removed');

                if (req.user) {
                    res.redirect('/users/');
                } else {
                    res.redirect('/');
                }
            });
        });
    }
});

module.exports = router;

//# sourceMappingURL=index.js.map