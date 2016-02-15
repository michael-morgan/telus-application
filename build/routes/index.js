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

module.exports = router;