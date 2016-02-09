var express = require('express');

var connection = require('../connection');
var passport = require('passport');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
	'title': 'Register'
  });
});

router.post('/register', function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
});

router.get('/login', function(req, res, next) {
  res.render('login', {
	'title': 'Login'
  });
});

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username or password'
}), function(req, res) {
    console.log('Authentication successful');
    req.flash('success', 'You are logged in');
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/users/login');
});

module.exports = router;