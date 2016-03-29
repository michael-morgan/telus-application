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
                req.flash('Duplicate T#, please enter a unique T#', 'Duplicate T#, please enter a unique T#');
                returnObj['message'] = req.flash('Duplicate T#, please enter a unique T#');
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
                        returnObj['message'] = req.flash('The activation email did not send, please try again');
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
                        returnObj['message'] = req.flash('Our database servers maybe down, please try again');
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
                        returnObj['message'] = req.flash('Our database servers maybe down, please try again');
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
    connection.get().query('SELECT * FROM users', function (err, results) {
        var returnObj = {
            title: 'Remove',
            users: results
        };

        //If an error is thrown
        if (err) {
            returnObj['message'] = req.flash('Failed to delete user, our database servers maybe down. Please try again.');
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
                returnObj['message'] = req.flash('Failed to delete user,our database servers maybe down.Please try again');
                //Render the page wth error messages
                return res.render('remove', returnObj);
            }

            console.log('Users removed');

            //Connection to get the the users after the selected users where deleted
            connection.get().query('SELECT * FROM users', function (err, results) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Failed to delete user,our database servers maybe down.Please try again');
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

// Get for observations when the page is loaded, show the observations for each user
router.get('/observations', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }

    var stores = {
        store_id:undefined,
        store_name:undefined
    };

    var returnObj = {
        title: 'Observations'
    };

    //Check if the current logged in user is a manager
    connection.get().query('SELECT stores.store_id, store_name,t_number FROM  stores ' +
        'INNER JOIN users ON stores.store_id = users.store_id ' +
        'WHERE t_number = ?', req.user.t_number, function (err, storesResults) {
        if (err) {
            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
            //Render the page wth error messages
            return res.render('observations', returnObj);
        }

        //Connection to get all the employees
        if(req.user.privileged == 1) {
            connection.get().query('SELECT first_name, last_name,t_number,store_id FROM users ', function (err, userResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('observations', returnObj);
                }

                //Connection to get all of the observations for each employee ordered by date
                connection.get().query(
                    'SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment, observations.observation_date , ' +
                    'observations.assigned_by, ASSIGNED_BY_STATEMENT.full_name AS assigned_by_name, observations.observation_type FROM users ' +
                    'INNER JOIN observations on users.t_number = observations.assigned_to ' +
                    'INNER JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'INNER JOIN skills on behaviours.skill_id = skills.skill_id ' +
                    'INNER JOIN (SELECT users.t_number AS assigned_by, observations.assigned_to AS assigned_to, CONCAT(users.first_name, " ", users.last_name) AS full_name FROM users ' +
                    'INNER JOIN observations on users.t_number = observations.assigned_by) as ASSIGNED_BY_STATEMENT on observations.assigned_by = ASSIGNED_BY_STATEMENT.assigned_by ' +
                    'GROUP BY observations.observation_id ORDER BY observations.observation_date DESC ', function (err, obsResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('observations', returnObj);
                        }

                        returnObj['users'] = userResults;
                        returnObj['observations'] = obsResults;
                        returnObj['stores'] = storesResults;
                        //Render the observations page with the list of users and observations
                        res.render('observations', returnObj);
                });
            });
        }
        else {
            connection.get().query('SELECT first_name, last_name,t_number,store_id FROM users WHERE t_number = ? ',req.user.t_number, function (err, userResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('observations', returnObj);
                }

                //Connection to get all of the observations for each employee ordered by date
                connection.get().query(
                    'SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment, observations.observation_date , ' +
                    'observations.assigned_by, ASSIGNED_BY_STATEMENT.full_name AS assigned_by_name, observations.observation_type FROM users ' +
                    'INNER JOIN observations on users.t_number = observations.assigned_to ' +
                    'INNER JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'INNER JOIN skills on behaviours.skill_id = skills.skill_id ' +
                    'INNER JOIN (SELECT users.t_number AS assigned_by, observations.assigned_to AS assigned_to, CONCAT(users.first_name, " ", users.last_name) AS full_name FROM users ' +
                    'INNER JOIN observations on users.t_number = observations.assigned_by) as ASSIGNED_BY_STATEMENT on observations.assigned_by = ASSIGNED_BY_STATEMENT.assigned_by ' +
                    'GROUP BY observations.observation_id ORDER BY observations.observation_date DESC ', function (err, obsResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('observations', returnObj);
                        }

                        returnObj['users'] = userResults;
                        returnObj['observations'] = obsResults;
                        returnObj['stores'] = storesResults;
                        //Render the observations page with the list of users and observations
                        res.render('observations', returnObj);
                });
            });
        }
    });
});

// When the add-observation page is loaded, render the add observations page
router.get('/add-observation', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }

    var returnObj = {
        title: 'Add Observation'
    };

    if(req.user.privileged == 1) {
        //Connection to get all of the employees in the users table
        connection.get().query('SELECT first_name, last_name,t_number FROM users WHERE store_id = ? ', req.user.store_id, function (err, userResults) {
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                return res.render('add-observation', returnObj);
            }

            //Get all the skills from the skills table
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again');
                    //Render the page wth error messages
                    return res.render('add-observation', returnObj);
                }

                //Connection to get the behaviours from the  behaviours table
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page with error messages
                        return res.render('add-observation', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] = behaviourResults;
                    //Render the page with the DB results
                    res.render('add-observation', returnObj);
                });
            });
        });
    }
    else {
        //Connection to get all of the employees in the users table
        connection.get().query('SELECT first_name, last_name,t_number FROM users WHERE t_number = ? ',req.user.t_number, function (err, userResults) {
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                return res.render('add-observation', returnObj);
            }

            //Get all the skills from the skills table
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('add-observation', returnObj);
                }

                //Connection to get the behaviours from the  behaviours table
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page with error messages
                        return res.render('add-observation', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] = behaviourResults;
                    //Render the page with the DB results
                    res.render('add-observation', returnObj);
                });
            });
        });
    }
});

//TODO: Cleanup from here down.
// When the add-observation page is loaded, and there is a t_number is the url. Render the add observations page
router.get('/add-observation/:employee', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    if(req.user.privileged == 1) {
        //Connection to get all of the employees in the users table
        connection.get().query('SELECT first_name, last_name,t_number FROM users WHERE store_id = ? ', req.user.store_id, function (err, userResults) {
            //If an error is thrown
            if (err) {
                //Render the page wth error messages
                return res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down. Please try again.')
                });
            }

            //Get all the skills from the skills table
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    //Render the page wth error messages
                    return res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down. Please try again.')
                    });
                }

                //Connection to get the behaviours from the behaviours table
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        //Render the page wth error messages
                        return res.render('add-observation', {
                            title: 'Add Observation',
                            message: req.flash('Our database servers maybe down.Please try again')
                        });
                    }

                    //Create object to hold the skill info
                    var skill = {
                        skill_title: undefined,
                        skill_id: undefined,
                    };

                    //Create object to hold the behaviour info
                    var behaviour = {
                        behaviour_desc: undefined,
                        behaviour_id: undefined,
                        skill_id: undefined
                    };

                    //Render the page with the query results
                    res.render('add-observation', {
                        title: 'Add Observation',
                        users: userResults,
                        skills: categoryResults,
                        behaviours: behaviourResults,
                        employee: req.params.employee
                    });
                });
            });
        });
    }
    else {
        connection.get().query('SELECT first_name, last_name,t_number FROM users WHERE t_number = ?',req.user.t_number, function (err, userResults) {
            //If an error is thrown
            if (err) {
                req.flash('Our database servers maybe down.Please try again',
                    'Our database servers maybe down.Please try again');
                //Render the page wth error messages
                return res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down.Please try again')
                });
            }

            //Get all the skills from the skills table
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    //Render the page wth error messages
                    return res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                }

                //Connection to get the behaviours from the behaviours table
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        //Render the page wth error messages
                        res.render('add-observation', {
                            title: 'Add Observation',
                            message: req.flash('Our database servers maybe down.Please try again')
                        }); //End render
                        return;
                    }

                    //Create object to hold the skill info
                    var skill = {
                        skill_title: undefined,
                        skill_id: undefined,
                    };

                    //Create object to hold the behaviour info
                    var behaviour = {
                        behaviour_desc: undefined,
                        behaviour_id: undefined,
                        skill_id: undefined
                    };

                    //Render the page with the query results
                    res.render('add-observation', {
                        title: 'Add Observation',
                        users: userResults,
                        skills: categoryResults,
                        behaviours: behaviourResults,
                        employee: req.params.employee
                    });
                });
            });
        });
    }
});


/**
 * When the observation is submitted, this router.post gets triggered.
 * It takes the form values from the front-end page and inserts them into the observations table
 */
router.post('/add-observation', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    //Ensure user is logged in
    //if (!req.user.privileged == null) {
    //    return res.redirect('/users/');
    //}

    //Check that the user has selected an employee
    if (req.body.employeeDropdown != undefined && req.body.goodorbad != undefined) {
        //Store form variables
        var behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
        var assignedTo = req.body.employeeDropdown;
        var assignedBy = req.user.t_number;
        var currentDate = getCurrentDate();
        var observationDate = currentDate;
        var observationType = req.body.goodorbad;

        //Assign observationType
        if (observationType.indexOf("good") != -1)
            observationType = "1";
        else
            observationType = "0";

        var observationComment = req.body.commentBox;

        //Creating the JSON array to store the observation data
        var observation = {
            behaviour_id: behaviour,
            assigned_to: assignedTo,
            assigned_by: assignedBy,
            observation_date: observationDate,
            observation_type: observationType,
            observation_comment: observationComment
        }; //End observation

        console.log(observation);

        //Inserting the data into the observations table using a JSON array
        connection.get().query('INSERT INTO observations SET ?', [observation], function (err, result) {
            //If an error is thrown
            if (err) {
                req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                //Render the page wth error messages
                res.render('add-observation', {
                    behaviour: behaviour,
                    assignedTo: assignedTo,
                    assignedBy: assignedBy,
                    observationDate: observationDate,
                    observationType: observationType,
                    observationComment: observationComment,
                    message: req.flash('Our database servers maybe down, please try again')
                }); //End render
                return;
            } //End if

            //Display a message in the console if the observation was successfully added
            console.log("Observation added");
            //req.flash('success_messages', 'The observation was successfully added to the database.');
            //res.locals.success_messages = req.flash('success_messages');

            //Connection to get all of the employees in the users table
            connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
                //If an error is thrown
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    //Render the page wth error messages
                    res.render('observations', {
                        title: 'Observations',
                        message: req.flash('Our database servers maybe down.Please try again')
                    }); //End render
                    return;
                } //End if

                //Get all of the observations for each employee
                connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, ' +
                    'observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' +
                    'LEFT JOIN observations on users.t_number = observations.assigned_to ' +
                    'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', function (err, obsResults) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        //Render the page wth error messages
                        res.render('observations', {
                            title: 'Observations',
                            message: req.flash('Our database servers maybe down.Please try again')
                        }); //End render
                        return;
                    } //End if
                    return res.redirect('/users/observations');
                }); //End connection for observations for each employee
            }); //End connection for users
        });
    }

    //Display error message if a user has not selected an employee for the dropdown
    else {
        //Connection to get all of the employees in the users table
        connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
            //If an error is thrown
            if (err) {
                req.flash('Our database servers maybe down.Please try again',
                    'Our database servers maybe down.Please try again');
                //Render the page wth error messages
                return res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down.Please try again')
                });
            }

            //Get all the skills from the skills table
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
                //if an error is thrown
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    //Render the page wth error messages
                    return res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                }

                //Connection to get the behaviours from the behaviours table
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        //Render the page wth error messages
                        return res.render('add-observation', {
                            title: 'Add Observation',
                            message: req.flash('Our database servers maybe down.Please try again')
                        });
                    }

                    //JSON array to hold skill info
                    var skill = {
                        skill_title: undefined,
                        skill_id: undefined
                    };

                    //JSON array to hold behaviour info
                    var behaviour = {
                        behaviour_desc: undefined,
                        behaviour_id: undefined,
                        skill_id: undefined
                    };

                    //Check if the user has selected an employee
                    if (req.body.employeeDropdown != undefined) {
                        req.flash('Please select a behaviour type', 'Please select a behaviour type');
                        return res.render('add-observation', {
                            title: 'Add Observation',
                            users: userResults,
                            skills: categoryResults,
                            behaviours: behaviourResults,
                            selectedEmployee: req.body.employeeDropdown,
                            message: req.flash('Please select a behaviour type')
                        });
                    }

                    //Check if the user has selected a behaviour type
                    else {
                        req.flash('Please select an employee', 'Please select an employee');
                        return res.render('add-observation', {
                            title: 'Add Observation',
                            users: userResults,
                            skills: categoryResults,
                            behaviours: behaviourResults,
                            message: req.flash('Please select an employee')
                        });
                    }
                });
            });
        });
    }
});


/**
 * When the observation is submitted, this router.post gets triggered.  It takes the form values from the front-end page and inserts them into the observations table
 * This method is called when there is an t_number in the url
 */
router.post('/add-observation/:employee', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    //Check that the user has selected an employee
    if (req.body.employeeDropdown != undefined && req.body.goodorbad != undefined) {
        //Store form variables
        var behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
        var assignedTo = req.body.employeeDropdown;
        var assignedBy = req.user.t_number;
        var currentDate = getCurrentDate();
        var observationDate = currentDate;
        var observationType = req.body.goodorbad;

        //Assign observationType
        if (observationType.indexOf("good") != -1) { observationType = "1"; }
        else { observationType = "0"; }

        var observationComment = req.body.commentBox;

        //Creating the JSON array to store the observation data
        var observation = {
            behaviour_id: behaviour,
            assigned_to: assignedTo,
            assigned_by: assignedBy,
            observation_date: observationDate,
            observation_type: observationType,
            observation_comment: observationComment
        }; //End observation

        console.log(observation);

        //Inserting the data into the observations table using a JSON array
        connection.get().query('INSERT INTO observations SET ?', [observation], function (err, result) {
            //If an error is thrown
            if (err) {
                req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                //Render the page wth error messages
                res.render('add-observation', {
                    behaviour: behaviour,
                    assignedTo: assignedTo,
                    assignedBy: assignedBy,
                    observationDate: observationDate,
                    observationType: observationType,
                    observationComment: observationComment,
                    message: req.flash('Our database servers maybe down, please try again')
                }); //End render
                return;
            } //End if

            //Display a message in the console if the observation was successfully added
            console.log("Observation added");
            //req.flash('success_messages', 'The observation was successfully added to the database.');
            //res.locals.success_messages = req.flash('success_messages');

            //Connection to get all of the employees in the users table
            connection.get().query('SELECT first_name, last_name,t_number FROM users', function (err, userResults) {
                //If an error is thrown
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    //Render the page wth error messages
                    res.render('observations', {
                        title: 'Observations',
                        message: req.flash('Our database servers maybe down. Please try again.')
                    }); //End render
                    return;
                } //End if

                //Get all of the observations for each employee
                connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, ' +
                    'observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' +
                    'LEFT JOIN observations on users.t_number = observations.assigned_to ' +
                    'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', function (err, obsResults) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        //Render the page wth error messages
                        res.render('observations', {
                            title: 'Observations',
                            message: req.flash('Our database servers maybe down.Please try again')
                        }); //End render
                        return;
                    } //End if
                    return res.redirect('/users/observations');
                }); //End connection for observations for each employee
            }); //End connection for users
        }); //End connection for insert

    } //End if - (req.body.employeeDropdown != undefined && req.body.goodorbad != undefined)

    //Display error message if a user has not selected an employee for the dropdown
    else {
        //Connection to get all of the employees in the users table
        connection.get().query('SELECT first_name, last_name,t_number FROM users', function (err, userResults) {
            //If an error is thrown
            if (err) {
                req.flash('Our database servers maybe down. Please try again.',
                    'Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down. Please try again.')
                }); //End render
                return;
            } //End if

            //Get all the skills from the skills table
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills', function (err, categoryResults) {
                //if an error is thrown
                if (err) {
                    req.flash('Our database servers maybe down. Please try again',
                        'Our database servers maybe down. Please try again');
                    //Render the page wth error messages
                    res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down. Please try again')
                    }); //End render
                    return;
                } //End if

                //Connection to get the behaviours from the behaviours table
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        req.flash('Our database servers maybe down. Please try again.',
                            'Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        res.render('add-observation', {
                            title: 'Add Observation',
                            message: req.flash('Our database servers maybe down. Please try again.')
                        }); //End render
                        return;
                    } //End if

                    //JSON array to hold skill info
                    var skill = {
                        skill_title: undefined,
                        skill_id: undefined,
                    }; //End skills

                    //JSON array to hold behaviour info
                    var behaviour = {
                        behaviour_desc: undefined,
                        behaviour_id: undefined,
                        skill_id: undefined
                    }; //End behaviour

                    //Check if the user has selected an employee
                    if (req.body.employeeDropdown != undefined) {
                        req.flash('Please select a behaviour type', 'Please select a behaviour type');
                        res.render('add-observation', {
                            title: 'Add Observation',
                            users: userResults,
                            skills: categoryResults,
                            behaviours: behaviourResults,
                            selectedEmployee: req.body.employeeDropdown,
                            message: req.flash('Please select a behaviour type')
                        }); //End render
                        return;
                    } //End if

                    //Check if the user has selected a behaviour type
                    else {
                        req.flash('Please select an employee', 'Please select an employee');
                        return res.render('add-observation', {
                            title: 'Add Observation',
                            users: userResults,
                            skills: categoryResults,
                            behaviours: behaviourResults,
                            message: req.flash('Please select an employee')
                        });
                    }
                });
            });
        });
    }
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

/**
 * Custom function that return the current date and time
 * @returns {string} in yyyy:mm:dd hh:mm:ss format
 */
function getCurrentDate() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var today = year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;

    return today;
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

module.exports = router;