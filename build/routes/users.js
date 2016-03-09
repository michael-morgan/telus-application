var express = require('express');

var connection = require('../connection');
var passport = require('passport');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');

var router = express.Router();

// get the users listing
router.get('/', ensureAuthenticated, function(req, res, next) {
    res.render('index', { title: 'Dashboard' });
});

// if accessing the register page, reset the form variables
router.get('/register', ensureAuthenticated, function(req, res, next) {
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }

    res.render('register', {
        title: 'Register',
        first: '',
        last: '',
        username: '',
        email: ''
    });
});

// form validation for the register page
router.post('/register', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }

    //Store form variables
    var first = req.body.firstName;
    var last = req.body.lastName;
    var username = req.body.username;
    var email = req.body.email;

    //Custom form validation
    req.checkBody('firstName', "First name field is required").notEmpty();
    req.checkBody('firstName', "Only letters A-Z maybe used in the first name").matches(/^[a-zA-Z]*$/);
    req.checkBody('lastName', "Last name field is required").notEmpty();
    req.checkBody('lastName', "Only letters A-Z maybe used in the last name").matches(/^[a-zA-Z]*$/);
    req.checkBody('email', "Invalid email").isEmail();
    req.checkBody('username', "T number required format: t123456").matches(/t[0-9]{6}/);

    //Check for errors
    var errors = req.validationErrors();
    if(errors) {
        res.render('register', {
            title: 'Register',
            errors: errors,
            first: first,
            last: last,
            email: email,
            username: username
        });
    }
    else {
        //Check for duplicate users
        connection.get().query('SELECT username FROM users WHERE username = ?',username, function (err, rows) {
            if(rows.length > 0)
            {
                req.flash('Duplicate T#, please enter a unique T#','Duplicate T#, please enter a unique T#');
                res.render('register', {
                    title: 'Register',
                    first: first,
                    last: last,
                    email: email,
                    username: username,
                    message: req.flash('Duplicate T#, please enter a unique T#')});
                    return;
            }
            //The user is unique, insert the user into the database and send them a token
            else
            {
                //generate token
                var token = randtoken.generate(16);

                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'maplefssb@gmail.com',
                        pass: '123Maple123'
                    }
                });

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: 'no-reply <no-reply@telus.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Verification', // subject line
                    html: '<p>Hello ' + first + ' ' + last + ', </p>' +
                    '<p>Click the following link to activate your account: </p>' +
                    'http://localhost:3000/activate/' + token
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, function(err, info){
                    if(err){
                        //Check if email can be sent
                        req.flash('The activation email did not send, please try again','The activation email did not send, please try again');
                        res.render('register', {
                            title: 'Register',
                            first: first,
                            last: last,
                            email: email,
                            username: username,
                            message: req.flash('The activation email did not send, please try again')});
                            return;
                    }
                    console.log('Message sent: ' + info.response);
                });

                var user = {
                    first_name: first,
                    last_name: last,
                    email: email,
                    username: username,
                    t_number: username
                };

                // database insertion
                connection.get().query('INSERT INTO users SET ?', [user], function(err, result) {
                    if(err) {
                        req.flash('Our database servers maybe down, please try again','Our database servers maybe down, please try again');
                        res.render('register', {
                            title: 'Register',
                            first: first,
                            last: last,
                            email: email,
                            username: username,
                            message: req.flash('Our database servers maybe down, please try again')});
                            return;
                    }
                    console.log("User added");
                });

                var token = {
                    t_number: username,
                    token: token
                };

                connection.get().query('INSERT INTO tokens SET ?', [token], function(err, result) {
                    if(err) {
                        req.flash('Our database servers maybe down, please try again','Our database servers maybe down, please try again');
                        res.render('register', {
                            title: 'Register',
                            first: first,
                            last: last,
                            email: email,
                            username: username,
                            message: req.flash('Our database servers maybe down, please try again')});
                        return;
                    }
                    console.log("Token added");

                    res.redirect('/users/');
                });
            }
        });

    }
});

// if accessing the register page, reset the form variables
router.get('/remove', ensureAuthenticated, function(req, res, next) {
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }

    connection.get().query('SELECT * FROM users', function(err, results) {
        if(err) {
            throw next(err);
        }

        res.render('remove', {
            title: 'Remove',
            users: results
        });
    });
});

router.post('/remove', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }
    if(req.body.submit == "cancel") {
        return res.redirect('/users/');
    }

    connection.get().query('SELECT * FROM users', function (err, results) {
        if (err) {
            throw next(err);
        }

        var removeIds = [];
        results.forEach(function (value, index) {
            if (req.body.hasOwnProperty('remove' + value.t_number)) {
                removeIds.push(value.t_number);
            }
        });

        connection.get().query('DELETE FROM users WHERE t_number IN (?)', [removeIds.toString()], function (err, results) {
            if (err) {
                throw next(err);
            }
            console.log('Users removed');

            connection.get().query('SELECT * FROM users', function (err, results) {
                res.render('remove', {
                    title: 'Remove',
                    users: results
                });
            });
        });
    });
});

// logout functionality
router.get('/logout', ensureAuthenticated, function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out');
    res.redirect('/');
});

// make sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;