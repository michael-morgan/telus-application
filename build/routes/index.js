var express = require('express');

var connection = require('../connection');
var passport = require('passport');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login', {
        'title': 'Login'
    });
});

router.post('/', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: 'Invalid username or password'
}), function(req, res) {
    console.log('Authentication successful');
    req.flash('success', 'You are logged in');
    res.redirect('/users/');
});

module.exports = router;