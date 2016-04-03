var express = require('express');
var connection = require('../connection');
var passport = require('passport');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');
var router = express.Router();

// get the users listing
router.get('/', ensureAuthenticated, function (req, res, next) {
    res.render('index', { title: 'Dashboard' });
});

// If accessing the register page, reset the form variables
router.get('/register', ensureAuthenticated, function (req, res, next) {
    if (!req.user.privileged) { return res.redirect('/users/'); }

    res.render('register', {
        title: 'Register',
        first: '',
        last: '',
        username: '',
        email: ''
    });
});

// Form validation for the register page
router.post('/register', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    if (!req.user.privileged) { return res.redirect('/users/'); }

    //Store the variables form the register page
    var first = req.body.firstName;
    var last = req.body.lastName;
    var username = req.body.username;
    var email = req.body.email;

    // return object
    var returnObj = {
        title: 'Register',
        first: first,
        last: last,
        email: email,
        username: username
    };

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
        returnObj['errors'] = errors;
        res.render('register', returnObj);
    }
    else {
        //Check for duplicate users
        connection.get().query('SELECT username FROM users WHERE username = ?', username, function (err, rows) {
            if (rows.length > 0) {
                returnObj['message'] = 'Duplicate T#, please enter a unique T#';
                return res.render('register', returnObj);
            }

            //The user is unique, insert the user into the database and send them a token
            else {
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

                // Send mail with defined transport object
                transporter.sendMail(mailOptions, function (err, info) {

                    //If an error is thrown
                    if (err) {
                        //Check if email can be sent
                        req.flash('The activation email did not send, please try again', 'The activation email did not send, please try again');
                        returnObj['message'] = 'The activation email did not send, please try again';
                        //Render the page wth error messages
                        return res.render('register', returnObj);
                    }
                    console.log('Message sent: ' + info.response);
                });

                //Create a user object
                var user = {
                    first_name: first,
                    last_name: last,
                    email: email,
                    username: username,
                    t_number: username,
                    store_id: undefined
                };

                // Create connection to add the user to the database
                connection.get().query('INSERT INTO users SET ?', [user], function (err, result) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                        returnObj['message'] = 'Our database servers maybe down, please try again';
                        //Render the page wth error messages
                        return res.render('register', returnObj);
                    }
                    console.log("User added");
                });

                // create a token object
                var tokenObj = {
                    t_number: username,
                    token: token
                };

                // create a connection to add the email token to the database
                connection.get().query('INSERT INTO tokens SET ?', [tokenObj], function (err, result) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                        returnObj['message'] = 'Our database servers maybe down, please try again';
                        //Render the page wth error messages
                        return res.render('register', returnObj);
                    }

                    console.log("Token added");
                    req.flash('success_messages', 'User successfully registered, a registration email has been sent');
                    res.locals.success_messages = req.flash('success_messages');
                    res.render('register', {
                        title: 'Register',
                        first: '',
                        last: '',
                        username: '',
                        email: ''
                    });
                });
            }
        });
    }
});

// Get method for remove users when the page is loaded
router.get('/remove', ensureAuthenticated, function (req, res, next) {
    //Ensure user is logged in
    if (!req.user.privileged) { return res.redirect('/users/'); }

    //Connect to the database and get all the user to show the user the list of deletable users
    connection.get().query('SELECT * FROM users', function (err, results) {
        if (err) {  throw next(err); }

        res.render('remove', {
            title: 'Remove',
            users: results
        });
    });
});

// Post for remove when the submit button is pressed
router.post('/remove', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    if (!req.user.privileged || req.body.submit == "cancel") { return res.redirect('/users/'); }

    //Connection for getting all the users
    selectAllUsers( function (err, results) {
        var returnObj = {
            title: 'Remove',
            users: results
        };

        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Failed to delete user, our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('remove', returnObj);
        }

        var removeIds = []; // User(s) to be deleted

        //Add to removeIds the user that where selected of the remove page
        results.forEach(function (value, index) {
            if (req.body.hasOwnProperty('remove' + value.t_number)) {
                //Check if the user is trying to delete themselves
                if(req.user.t_number == value.t_number){
                    req.flash('error_messages', 'Can\'t delete yourself!');
                    res.locals.error_messages = req.flash('error_messages');
                }
                else {
                    removeIds.push(value.t_number);
                    req.flash('success_messages', 'User successfully deleted');
                    res.locals.success_messages = req.flash('success_messages');
                }
            }
        });

        //Connection for deleted the users. Deletes the users who are in 'removeIds'
        connection.get().query('DELETE FROM users WHERE t_number IN (?)', [removeIds.toString()], function (err, results) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = 'Failed to delete user,our database servers maybe down.Please try again';
                //Render the page wth error messages
                return res.render('remove', returnObj);
            }


            //Connection to get the the users after the selected users where deleted
            selectAllUsers(function (err, results) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Failed to delete user,our database servers maybe down.Please try again';
                    //Render the page wth error messages
                    return res.render('remove', returnObj);
                }

                returnObj['users'] = results;
                //Re-render the remove users page
                res.render('remove', returnObj);
            });
        });
    });
});



// Get method for the logout page
router.get('/logout', ensureAuthenticated, function (req, res) {
    req.logout(); //Log the user out
    req.flash('success', 'You have logged out');
    res.redirect('/');
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

router.get('/settings', ensureAuthenticated, function (req, res, next) {
    if (!req.user.privileged) {
        return res.redirect('/users/');
    }

    //Show the register page
    res.render('settings', {
        title: 'Settings'
    });
});
//Select all users in the db
function selectAllUsers(callback) {
    connection.get().query('SELECT * FROM users', function(err, rows) {
        if (err) {
            callback(err, null);
        } else
            callback(null, rows);
    });
};

module.exports = router;