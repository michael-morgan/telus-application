var express = require('express');
var connection = require('../../connection');
var passport = require('passport');

var router = express.Router();


// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

router.get('/', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    res.render('coaching/binder', {
        title: 'Coaching Binder'
    });
});


module.exports = router;