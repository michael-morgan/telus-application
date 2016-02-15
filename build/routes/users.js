var express = require('express');

var connection = require('../connection');
var passport = require('passport');

var router = express.Router();

/* GET users listing. */
router.get('/', ensureAuthenticated, function(req, res, next) {
    connection.get().query('SELECT * FROM users', function(err, rows) {
        if(err) {
            throw err;
        }
        console.log(rows[0]);
    });

    res.render('index', { title: 'Dashboard' });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

router.get('/register', function(req, res, next) {
  res.render('register', {
	'title': 'Register',
    'first': '',
    'last': '',
    'username': '',
    'email': ''
  });
});

router.post('/register', function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    //Store form variables
    var first = req.body.firstName;
    var last = req.body.lastName;
    var username = req.body.username;
    var email = req.body.email;

    //Custom form validation
    req.checkBody({
        'firstName': {
            notEmpty: true,
                errorMessage: 'First name field is required'
        },
        'lastName': {
            notEmpty: true,
            errorMessage: 'Last name field is required'
        },
        'email': {
            notEmpty: true,
            isEmail: {
                errorMessage: 'Invalid Email'
            }
        },
        'username': {
            notEmpty: true,
            isLength: {
                options: [{min: 7, max: 7}],
                errorMessage: 'T# required'
            }
            //TODO: /t[0-9]{6}/
        }
    });

    //Check for errors
    var errors = req.validationErrors();
    if(errors) {
        req.flash('error', 'Missing required fields');
        res.render('register', {
            errors: errors,
            first: first,
            last: last,
            email: email,
            username: username
        });
    }
    else {
        var user = {
          first_name: first,
          last_name: last,
          email: email,
          username: username
        };

        //Database insertion
        connection.get().query('INSERT INTO user SET ?', user, function(err, result) {
            if(err) {
                throw err;
            }

            console.log("User added");
        });
        res.redirect('/users/');
    }
});

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/');
});

module.exports = router;