var express = require('express');
var connection = require('../connection');
var credential = require('../credential');
var passport = require('passport');
var nodemailer = require('nodemailer');
import * as randtoken from "rand-token";
import * as bcrypt from "bcryptjs";
import * as utility from "../utility";
var router = express.Router();

var userModel = require('../models/user');
var tokenModel = require('../models/token');
var storesModel = require('../models/store');

// get the users listing
router.get('/', ensureAuthenticated, (req, res, next) => {

    // Check if store_id session value is set
    // if not then set it
    if(!req.session.store_id) {
        storesModel.getFirstStoreByTNumber(req.user.t_number, (err, result) => {
            if(err) {
                utility.log({ type: 'log', message: 'Error retrieving first store.'});
                return;
            }

            req.session.store_id = result[0].store_id;

            // log the store id
            utility.log({ type: 'log', message: req.session.store_id});
        });
    }

    var returnObj = {
        title: 'Dashboard',
        success_message: req.flash('success'),
        error_message: req.flash('error')
    };

    //Connection to get all of the observations for each employee ordered by date
    getRecentObservations((err, obsResults) => {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('index', returnObj);
        }

        returnObj['recentObservations'] = obsResults;

        //Render the observations page with the list of users and observations
        res.render('index', returnObj);
    });
});

// If accessing the register page, reset the form variables
router.get('/register', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    storesModel.getStores((err, result) => {
        if(err) {
            throw next(err);
        }

        return res.render('register', {
            title: 'Register',
            first: '',
            last: '',
            username: '',
            privileged: '',
            email: '',
            stores: result,
            storesObj: JSON.stringify(result)
        });
    });
});

// Form validation for the register page
router.post('/register', ensureAuthenticated, function (req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    if(req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    //Store the variables form the register page
    var first = req.body.firstName;
    first = first.charAt(0).toUpperCase() + first.substring(1).toLowerCase();

    var last = req.body.lastName;
    last = last.charAt(0).toUpperCase() + last.substring(1).toLowerCase();

    var username = req.body.username;
    username = username.toLowerCase();

    var privileged = req.body.privileged;

    var email = req.body.email;
    email = email.toLowerCase();

    // return object
    var returnObj = {
        title: 'Register',
        first: first,
        last: last,
        email: email,
        privileged: privileged,
        username: username
    };

    //Custom form validation
    req.checkBody('firstName', "First name field is required").notEmpty();
    req.checkBody('firstName', "Only letters A-Z maybe used in the first name").matches(/^[a-zA-Z]*$/);
    req.checkBody('lastName', "Last name field is required").notEmpty();
    req.checkBody('lastName', "Only letters A-Z maybe used in the last name").matches(/^[a-zA-Z]*$/);
    req.checkBody('email', "Invalid email, must follow example@telus.com").isEmail().matches(/^[A-Z0-9._%+-]+@telus.com$/);
    req.checkBody('username', "T number required format: t123456").matches(/t[0-9]{6}/);

    // grab stores for returnObj
    storesModel.getStores((err, result) => {
        if(err) {
            throw next(err);
        }

        returnObj['stores'] = result;
        returnObj['storesObj'] = JSON.stringify(result);

        //Check for errors
        var errors = req.validationErrors();

        if(errors) {
            returnObj['errors'] = errors;
            return res.render('register', returnObj);
        }
        else {
            //Check for duplicate users
            userModel.exists(username, function(err, rows) {
                if (rows.length > 0) {
                    returnObj['message'] = 'Duplicate T#, please enter a unique T#';
                    return res.render('register', returnObj);
                }
                else {
                    //Check for duplicate emails
                    userModel.emailExists(email, function(err, rows) {
                        if (rows.length > 0) {
                            returnObj['message'] = 'Sorry that email is already in use!';
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
                                    user: credential.EMAIL_USERNAME,
                                    pass: credential.EMAIL_PASSWORD
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
                                utility.log({ type: 'log', message: 'Message sent: ' + info.response });
                            });

                            //Create a user object
                            var user = {
                                first_name: first,
                                last_name: last,
                                email: email,
                                privileged: privileged,
                                username: username,
                                t_number: username
                            };

                            // Create connection to add the user to the database
                            userModel.create(user, function (err, result) {
                                //If an error is thrown
                                if (err) {
                                    req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                                    returnObj['message'] = 'Our database servers maybe down, please try again';
                                    //Render the page wth error messages
                                    return res.render('register', returnObj);
                                }

                                utility.log({ type: 'log', message: "User added successfully." });

                                // create a token object
                                var tokenObj = {
                                    t_number: username,
                                    token: token
                                };

                                // create a connection to add the email token to the database
                                tokenModel.create(tokenObj, function (err, result) {
                                    //If an error is thrown
                                    if (err) {
                                        req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                                        returnObj['message'] = 'Our database servers maybe down, please try again';
                                        //Render the page wth error messages
                                        return res.render('register', returnObj);
                                    }

                                    utility.log({ type: 'log', message: "Token added" });

                                    let stores = req.body['stores[]'];

                                    //Create a user object
                                    let storeObjArr = [];

                                    for(var store in stores) {
                                        storeObjArr[store] = [req.body.username, stores[store]];
                                    }

                                    storesModel.addStore(storeObjArr, function (err, result) {
                                        //If an error is thrown
                                        if (err) {
                                            req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                                            returnObj['message'] = 'Our database servers maybe down, please try again';
                                            //Render the page wth error messages
                                            return res.render('register', returnObj);
                                        }

                                        utility.log({ type: 'log', message: "Store added successfully." });

                                        req.flash('success_messages', 'User successfully registered, a registration email has been sent');
                                        res.locals.success_messages = req.flash('success_messages');
                                        res.render('register', {
                                            title: 'Register',
                                            first: '',
                                            last: '',
                                            username: '',
                                            privileged: '',
                                            email: '',
                                            stores: returnObj['stores'],
                                            storesObj: returnObj['storesObj']
                                        });
                                    });
                                });
                            });
                        }
                    });
                }
            });
        }
    });
});


// Get method for edit users when the page is loaded
router.get('/edit', ensureAuthenticated, function (req, res, next) {
    //Ensure user is logged in
    if (req.user.privileged <= 2) { return res.redirect('/users/'); }

    let returnObj = { title: 'Edit' };

    storesModel.getStores((err, storeResults) => {
        if(err) {
            throw next(err);
        }

        returnObj['stores'] = storeResults;
        returnObj['storesObj'] = JSON.stringify(storeResults);

        storesModel.getStoresUtil((err, storesUtilResults) => {
            if(err) {
                throw next(err);
            }

            let storesUtilObj = storesUtilResults;

            //Connect to the database and get all the user to show the user the list of deletable users
            userModel.getAll((err, userResults) => {
                if (err) {
                    throw next(err);
                }

                returnObj['users'] = [];
                userResults.forEach((user) => {
                    delete user['password'];

                    user['stores'] = storesUtilObj.filter((store) => store.t_number == user.t_number);

                    returnObj['users'].push(user);
                });

                returnObj['usersObj'] = JSON.stringify(returnObj['users']);

                res.render('edit', returnObj);
            });
        });
    });
});

router.post('/edit', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    if (req.user.privileged <= 2) { return res.redirect('/users/'); }

    userModel.update([req.body.t_number, req.body.first_name, req.body.last_name,
                    req.body.email, req.body.title, req.body.t_number], (err, result) => {
        if (err) {
            utility.log({ type: 'error', message: 'Error updating user ' + req.body.t_number });
        }

        utility.log({ type: 'log', message: 'Updated user ' + req.body.t_number });

        storesModel.deleteStores(req.body.t_number, function (err, result) {
            //If an error is thrown
            if (err) {
                utility.log({ type: 'error', message: 'Error deleting stores' });
            }

            let stores = JSON.parse(req.body.stores);

            //Create a user object
            let storeObjArr = [];

            for(var store in stores) {
                if(!stores.hasOwnProperty(store)) { continue; }
                storeObjArr[store] = [req.body.t_number, stores[store].store_id];
            }

            storesModel.addStore(storeObjArr, function (err, result) {
                //If an error is thrown
                if (err) {
                    utility.log({ type: 'error', message: 'Error updating stores' });
                }

                res.send(JSON.stringify(req.body));
            });
        });
    });
});

// Post for edit when the submit button is pressed
router.post('/remove', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    if (req.user.privileged <= 2 || req.body.submit == "cancel") { return res.redirect('/users/'); }

    //Connection for getting all the users
    userModel.getAll(function(err, results) {
        var returnObj = {
            title: 'Remove',
            users: results
        };

        //If an error is thrown
        if (err) {
            returnObj['message'] = err.toString();
            //Render the page wth error messages
            return res.render('edit', returnObj);
        }

        var removeIds = []; // User(s) to be deleted

        //Add to removeIds the user that where selected of the edit page
        results.forEach(function (value, index) {
            if (req.body.hasOwnProperty('remove' + value.t_number)) {
                //Check if the user is trying to delete themselves
                if(req.user.t_number == value.t_number){
                    req.flash('error_messages', 'Can\'t delete yourself!');
                    res.locals.error_messages = req.flash('error_messages');
                }
                else {
                    removeIds.push(value.t_number);
                }
            }
        });

        //Connection for deleted the users. Deletes the users who are in 'removeIds'
        userModel.deleteByIds(removeIds, function(err, results) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = err.toString();
                //Render the page wth error messages
                return res.render('edit', returnObj);
            }
            else
            {
                req.flash('success_messages', 'User successfully deleted');
                res.locals.success_messages = req.flash('success_messages');
            }

            //Connection to get the the users after the selected users where deleted
            userModel.getAll(function(err, results) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = err.toString();
                    //Render the page wth error messages
                    return res.render('edit', returnObj);
                }

                returnObj['users'] = results;
                //Re-render the edit users page
                res.render('edit', returnObj);
            });
        });
    });
});

router.get('/password/:id', ensureAuthenticated, (req, res, next) => {
    let id = req.params.id.toLowerCase();

    res.render('password', {
        title: 'New Password',
        id: id,
        error_message: req.flash('error')
    });
});

router.post('/password', ensureAuthenticated, (req, res, next) => {
    if (!req.body) { return res.sendStatus(400); }

    utility.log({ type: 'log', message: 'Token: ' + req.body.passwordToken });
    utility.log({ type: 'log', message: 'Password: ' + req.body.inputPassword });
    utility.log({ type: 'log', message: 'Password Verify: ' + req.body.inputPasswordVerify });

    //Store the variables form the register page
    let token = req.body.passwordToken;
    let password = req.body.inputPassword;
    let passwordVerify = req.body.inputPasswordVerify;

    if(password !== passwordVerify) {
        req.flash('error', 'Passwords must match.');
        return res.redirect('/users/password/' + token);
    }

    //Custom form validation
    req.checkBody('inputPassword',
    `Password must be a minimum of 6 characters. 
    Password must contain only letters and numbers. 
    Password must contain at least 1 uppercase letter and number.`).notEmpty().matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/);

    //Check for errors
    let errors = req.validationErrors();

    if(errors) {
        req.flash('error', errors[0].msg);
        return res.redirect('/users/password/' + token);
    }
    else {
        bcrypt.hash(password, 8, (err, hash) => {
            if(err) {
                throw next(err);
            }

            connection.get().query(`UPDATE users 
                INNER JOIN tokens ON users.t_number = tokens.t_number 
                SET users.password = ? 
                WHERE tokens.token = ?`, [hash, token], (err, rows) => {
                if (err) {
                    req.flash('error', 'Our database servers maybe down, please try again');

                    return res.redirect('/users/password/' + token);
                }

                utility.log({ type: 'log', message: 'Changed user password' });
                utility.log({ type: 'log', message: 'Token to delete: ' + token });

                tokenModel.deleteById(token, (err, rows) => {
                    if (err) {
                        req.flash('error', 'Our database servers maybe down, please try again');

                        return res.redirect('/users/password/' + token);
                    }
                    utility.log({ type: 'log', message: 'Token record removed' });

                    req.flash('success', 'Password successfully changed.');
                    res.redirect('/users/');
                });
            });
        });
    }
});

router.get('/password-change', ensureAuthenticated, (req, res, next) => {
    let token = randtoken.generate(16);

    utility.log({ type: 'log', message: 'Token: ' + token });
    utility.log({ type: 'log', message: 'T_Number: ' + req.user.t_number });

    // create a connection to add the password token to the database
    tokenModel.create({ t_number: req.user.t_number, token: token }, function (err, result) {
        //If an error is thrown
        if (err) {
            req.flash('error', 'Our database servers maybe down, please try again');

            // redirect with error messages
            return res.redirect('/users/settings/');
        }

        utility.log({ type: 'log', message: "Token added" });

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: credential.EMAIL_USERNAME,
                pass: credential.EMAIL_PASSWORD
            }
        });

        let email = 'personal.michaelmorgan@gmail.com';

        // setup e-mail data with unicode symbols
        let mailOptions = {
            from: 'no-reply <no-reply@telus.com>', // sender address
            to: email, // list of receivers
            subject: 'Password Reset', // subject line
            html: '<p>Hello ' + req.user.first_name + ' ' + req.user.last_name + ', </p>' +
            '<p>Click the following link to change your password: </p>' +
            'http://localhost:3000/users/password/' + token
        };

        // Send mail with defined transport object
        transporter.sendMail(mailOptions, function (err, info) {
            //If an error is thrown
            if (err) {
                //Check if email can be sent
                req.flash('error', 'The password reset email did not send, please try again');

                // redirect with error messages
                return res.redirect('/users/settings/');
            }

            utility.log({ type: 'log', message: 'Message sent: ' + info.response });

            // successful redirect
            req.flash('success', 'The password change email has been successfully sent.');
            res.redirect('/users/settings/');
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

router.get('/settings', ensureAuthenticated, function(req, res, next) {
    if (req.user.privileged <= 1) {
        return res.redirect('/users/');
    }

    //Show the Settings page
    res.render('settings', {
        title: 'Settings',
        success_message: req.flash('success'),
        error_message: req.flash('error')
    });
});

router.get('/profile/:id', ensureAuthenticated, function(req, res, next) {
    var id = req.params.id.toLowerCase();

    userModel.getById(id, function(err, rows) {
        if(err) {
            throw next(err);
        }
        else if(rows.length <= 0) {
            utility.log({ type: 'error', message: 'Invalid profile id.' });
            return res.redirect('/users/');
        }
        else {
            var returnObj = {
                first_name: rows[0].first_name,
                last_name: rows[0].last_name,
                t_number: rows[0].t_number,
                email: rows[0].email,
                privileged: rows[0].privileged
            };

            //Render profile page with supplied user
            res.render('profile', { userObj: returnObj });
        }
    });
});

// If accessing the documentation page
router.get('/documentation', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    res.render('documentation', {
        title: 'Documentation'
    });
});

function getRecentObservations(callback){
    connection.get().query('SELECT users.t_number,users.first_name, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment, observations.observation_date , '+
    'observations.assigned_by, ASSIGNED_BY_STATEMENT.full_name AS assigned_by_name, observations.observation_type FROM users '+
    'INNER JOIN observations on users.t_number = observations.assigned_to ' +
    'INNER JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id '+
    'INNER JOIN skills on behaviours.skill_id = skills.skill_id '+
    'INNER JOIN (SELECT users.t_number AS assigned_by, observations.assigned_to AS assigned_to, CONCAT(users.first_name, " ", users.last_name) AS full_name FROM users '+
    'INNER JOIN observations on users.t_number = observations.assigned_by) as ASSIGNED_BY_STATEMENT on observations.assigned_by = ASSIGNED_BY_STATEMENT.assigned_by '+
    'GROUP BY observations.observation_id ORDER BY observations.observation_date DESC '+
    'LIMIT 3;', function(err, rows) {
        if (err) {
            callback(err, null);
        } else
            callback(null, rows);
    });
}

module.exports = router;


