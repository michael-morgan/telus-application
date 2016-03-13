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
            req.flash('Failed to delete user,our database servers maybe down.Please try again',
                'Failed to delete user,our database servers maybe down.Please try again');
            res.render('remove', {
                title: 'Remove',
                users: results,
                message: req.flash('Failed to delete user,our database servers maybe down.Please try again')});
            return;
        }

        var removeIds = [];
        results.forEach(function (value, index) {
            if (req.body.hasOwnProperty('remove' + value.t_number)) {
                removeIds.push(value.t_number);
                req.flash('success_messages', 'User successfully deleted');
                res.locals.success_messages = req.flash('success_messages');
            }
        });

        connection.get().query('DELETE FROM users WHERE t_number IN (?)', [removeIds.toString()], function (err, results) {
            if (err) {
                req.flash('Failed to delete user,our database servers maybe down.Please try again',
                    'Failed to delete user,our database servers maybe down.Please try again');
                res.render('remove', {
                    title: 'Remove',
                    users: results,
                    message: req.flash('Failed to delete user,our database servers maybe down.Please try again')});
                return;
            }
            console.log('Users removed');

            connection.get().query('SELECT * FROM users', function (err, results) {
                if(err)
                {
                    req.flash('Failed to delete user,our database servers maybe down.Please try again',
                        'Failed to delete user,our database servers maybe down.Please try again');
                    res.render('remove', {
                        title: 'Remove',
                        users: results,
                        message: req.flash('Failed to delete user,our database servers maybe down.Please try again')});
                    return;
                }
                //else successful removal of user
                res.render('remove', {
                    title: 'Remove',
                    users: results
                });
            });
        });
    });
});


router.get('/observations', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }

    res.render('observations', {
        title: 'Observation List'
    });

});

router.get('/observations/add-observation', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }

    res.render('add-observation', {
        title: 'Add Observation'
    });

});

router.post('/observations/add-observation', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    if (!req.user.privileged) {
        return res.redirect('/users/');
    }

    //Store form variables
    var behaviour = req.body.behaviour;
    var ccSkill = req.body.ccSkill;
    var assignedTo = req.body.assignedTo;
    var assignedBy = req.body.assignedBy;
    var observationDate = req.body.observationDate;
    var observationType = req.body.observationType;
    var observationComment = req.body.observationComment;

    var observation = {
        behaviour_id: behaviour,
        skill_id: ccSkill,
        assigned_to: assignedTo,
        assigned_by: assignedBy,
        observation_date: observationDate,
        observation_type: observationType,
        observation_comment: observationComment
    };

    connection.get().query('INSERT INTO observations SET ?', [observation], function(err, result){
        if(err) {
            req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
            res.render('add-observation', {
                behaviour: behaviour,
                ccSkill: ccSkill,
                assignedTo: assignedTo,
                assignedBy: assignedBy,
                observationDate: observationDate,
                observationType: observationType,
                observationComment: observationComment,
                message: req.flash('Our database servers maybe down, please try again')
            });
            return;
        }

        console.log("Observation added");
        req.flash('success_messages', 'The observation was successfully added to the database.');
        res.locals.success_messages = req.flash('success_messages');
        res.render('observations', { title: 'Observations' });

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