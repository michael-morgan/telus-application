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

// If accessing the register page, reset the form variables
router.get('/register', ensureAuthenticated, function(req, res, next) {
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }

    //Show the register page
    res.render('register', {
        title: 'Register',
        first: '',
        last: '',
        username: '',
        email: ''
    });
});

/**
 * Form validation for the register page
 */
router.post('/register', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    }
    if(!req.user.privileged) {
        return res.redirect('/users/');
    }

    //Store the variables form the register page
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
            if(rows.length > 0) {
                req.flash('Duplicate T#, please enter a unique T#','Duplicate T#, please enter a unique T#');
                res.render('register', {
                    title: 'Register',
                    first: first,
                    last: last,
                    email: email,
                    username: username,
                    message: req.flash('Duplicate T#, please enter a unique T#')});
                    return;
            } // End if

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
                }); // End createTransport

                // setup e-mail data with unicode symbols
                var mailOptions = {
                    from: 'no-reply <no-reply@telus.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Verification', // subject line
                    html: '<p>Hello ' + first + ' ' + last + ', </p>' +
                    '<p>Click the following link to activate your account: </p>' +
                    'http://localhost:3000/activate/' + token
                }; //End mailOptions

                // Send mail with defined transport object
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
                    } //End if
                    console.log('Message sent: ' + info.response);
                }); //End sendMail

                //Create a user object
                var user = {
                    first_name: first,
                    last_name: last,
                    email: email,
                    username: username,
                    t_number: username,
                };

                // Create connection to add the user to the database
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
                    } //End if
                    console.log("User added");
                }); //End connection

                //Create a token object
                var token = {
                    t_number: username,
                    token: token
                }; //End token

                //Create a connection to add the email token to the database
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
                    } //End if

                    console.log("Token added");
                    req.flash('success_messages', 'User successfully registered, a registration email has been sent');
                    res.locals.success_messages = req.flash('success_messages');
                    res.render('register', {
                         title: 'Register',
                         first: '',
                         last: '',
                         username: '',
                         email: ''
                    }); //End render
                }); //End connection for token
            } //End else
        }); //End connection for adding user to the database
    } //End else
}); //End post for register


/**
 * Get method for remove users
 * When the page is loaded
 */
router.get('/remove', ensureAuthenticated, function(req, res, next) {
    //Ensure user is logged in
    if(!req.user.privileged) {
        return res.redirect('/users/'); //redirect if not
    }

    //Connect to the database and get all the user to show the user the list of deletable users
    connection.get().query('SELECT * FROM users', function(err, results) {
        if(err) {
            throw next(err);
        } //End if

        res.render('remove', {
            title: 'Remove',
            users: results
        }); //End user
    }); // End connection for getting users
}); //End get for Remove

/**
 * Post for remove
 * When the submit button is pressed
 */
router.post('/remove', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    } //End if

    if(!req.user.privileged) {
        return res.redirect('/users/');
    } //End if

    if(req.body.submit == "cancel") {
        return res.redirect('/users/');
    } //End if

    //Connection for getting all the users
    connection.get().query('SELECT * FROM users', function (err, results) {
        if (err) {
            req.flash('Failed to delete user,our database servers maybe down.Please try again',
                'Failed to delete user,our database servers maybe down.Please try again');
            res.render('remove', {
                title: 'Remove',
                users: results,
                message: req.flash('Failed to delete user,our database servers maybe down.Please try again')});
            return;
        } //End if

        var removeIds = []; //User to be deleted

        //Add to removeIds the user that where selected of the remove page
        results.forEach(function (value, index) {
            if (req.body.hasOwnProperty('remove' + value.t_number)) {
                removeIds.push(value.t_number);
                req.flash('success_messages', 'User successfully deleted');
                res.locals.success_messages = req.flash('success_messages');
            } //End is
        }); //End forEach

        //Connection for deleted the users. Deletes the users who are in 'removeIds'
        connection.get().query('DELETE FROM users WHERE t_number IN (?)', [removeIds.toString()], function (err, results) {
            if (err) {
                req.flash('Failed to delete user,our database servers maybe down.Please try again',
                    'Failed to delete user,our database servers maybe down.Please try again');
                res.render('remove', {
                    title: 'Remove',
                    users: results,
                    message: req.flash('Failed to delete user,our database servers maybe down.Please try again')});
                return;
            } //End if

            console.log('Users removed');

            //Connection to get the the users after the selected users where deleted
            connection.get().query('SELECT * FROM users', function (err, results) {
                if(err) {
                    req.flash('Failed to delete user,our database servers maybe down.Please try again',
                        'Failed to delete user,our database servers maybe down.Please try again');
                    res.render('remove', {
                        title: 'Remove',
                        users: results,
                        message: req.flash('Failed to delete user,our database servers maybe down.Please try again')});
                    return;
                } //End if

                //Re render the remove users page
                res.render('remove', {
                    title: 'Remove',
                    users: results
                }); //End render
            }); //End connection for getting the users
        }); //End connection for deleted the user
    }); //End connection for selecting all the users
}); //End post for remove

/**
 * Get for observations
 * When the page is loaded, show the observations for each user
 */
router.get('/observations', ensureAuthenticated, function(req, res, next) {
    if(!req.body) {
        return res.sendStatus(400);
    } //End if

    if(!req.user.privileged) {
        return res.redirect('/users/');
    } //End if

    //Create a observation object
    var observation = {
        observation_comment: undefined,
        behaviour_desc: undefined,
        skill_title: undefined,
        observation_date: undefined,
        observation_id: undefined,
        assigned_by: undefined,
        observation_type: undefined
    }; //End observation object


    //Brad you are here!!!!!!!!!!

    //get all of the employees in the users table
    connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
        if(err) {
            req.flash('Our database servers maybe down.Please try again',
                'Our database servers maybe down.Please try again');
            res.render('observations', {
                title: 'Observations',
                message: req.flash('Our database servers maybe down.Please try again')});
            return;
        }
        //TODO:Figure out how to assigned by to name, SQL is working below but jade cannot access json data
        //Get all of the observations for each employee ordered by date
        /*
        connection.get().query('DROP VIEW IF EXISTS namesColumn; '+
            'CREATE VIEW namesColumn AS '+
            'SELECT users.t_number, users.first_name, users.last_name, observations.assigned_by '+
            'FROM users '+
            'LEFT JOIN observations on users.t_number = observations.assigned_by; '+
        'SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment, observations.observation_date ,  observations.assigned_by, CONCAT_WS(" ", namesColumn.first_name, namesColumn.last_name) AS '+'assigned_by'+ ' FROM users '+
        'LEFT JOIN observations on users.t_number = observations.assigned_to '+
        'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id '+
        'LEFT JOIN skills on behaviours.skill_id = skills.skill_id '+
        'LEFT JOIN namesColumn on namesColumn.assigned_by = observations.assigned_by ', function (err, obsResults) {*/
        connection.get().query(
            'SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment, observations.observation_date ,  observations.assigned_by, observations.observation_type  FROM users '+
            'LEFT JOIN observations on users.t_number = observations.assigned_to '+
            'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id '+
            'LEFT JOIN skills on behaviours.skill_id = skills.skill_id ', function (err, obsResults) {


            if(err)
            {
                req.flash('Our database servers maybe down.Please try again',
                    'Our database servers maybe down.Please try again');
                res.render('observations', {
                    title: 'Observations',
                    message: req.flash('Our database servers maybe down.Please try again')});
                return;
            }
            console.log(obsResults);
            //Render the observations page with the list of users and observations
            res.render('observations', {
                title: 'Observations',
                users: userResults,
                observations: obsResults
            });

            });
        });
});

//When the add-observation page is loaded, this router.get sets the page title

router.get('/add-observation', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    if (!req.user.privileged) {
        return res.redirect('/users/');
    }

    //get all of the employees in the users table
    connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
        if (err) {
            req.flash('Our database servers maybe down.Please try again',
                'Our database servers maybe down.Please try again');
            res.render('add-observation', {
                title: 'Add Observation',
                message: req.flash('Our database servers maybe down.Please try again')
            });
            return;
        }
        //Get all the behaviours and skills from db
        connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ' , function (err, categoryResults) {
            if (err) {
                req.flash('Our database servers maybe down.Please try again',
                    'Our database servers maybe down.Please try again');
                res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down.Please try again')
                });
                return;
            }
            connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours '+
            'JOIN skills on behaviours.skill_id = skills.skill_id' , function (err, behaviourResults) {
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                    return;
                }

                var skill = {
                    skill_title: undefined,
                    skill_id: undefined,
                };

                var behaviour = {
                    behaviour_desc: undefined,
                    behaviour_id: undefined,
                    skill_id: undefined
                };

                res.render('add-observation', {
                    title: 'Add Observation',
                    users: userResults,
                    skills: categoryResults,
                    behaviours: behaviourResults
                });
            });

        });
});
});

//When the add-observation page is loaded, this router.get sets the page title
router.get('/add-observation/:employee', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    if (!req.user.privileged) {
        return res.redirect('/users/');
    }

    //get all of the employees in the users table
    connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
        if (err) {
            req.flash('Our database servers maybe down.Please try again',
                'Our database servers maybe down.Please try again');
            res.render('add-observation', {
                title: 'Add Observation',
                message: req.flash('Our database servers maybe down.Please try again')
            });
            return;
        }
        //Get all the behaviours and skills from db
        connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
            if (err) {
                req.flash('Our database servers maybe down.Please try again',
                    'Our database servers maybe down.Please try again');
                res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down.Please try again')
                });
                return;
            }
            connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                    return;
                }

                var skill = {
                    skill_title: undefined,
                    skill_id: undefined,
                };

                var behaviour = {
                    behaviour_desc: undefined,
                    behaviour_id: undefined,
                    skill_id: undefined
                };

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
});


//When the observation is submitted, this router.post gets triggered.  It takes the form values from the front-end page
//and inserts them into the observations table
router.post('/add-observation', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    if (!req.user.privileged) {
        return res.redirect('/users/');
    }
    //Check that the user has selected an employee
    if(req.body.employeeDropdown != undefined && req.body.goodorbad != undefined)
    {

        //Store form variables
        var behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
        //var skill_id = req.body.goodorbad.replace("bad","").replace("good","");
        var assignedTo = req.body.employeeDropdown;
        var assignedBy = req.user.t_number;
        var currentDate = getCurrentDate();
        var observationDate = currentDate;
        var observationType = req.body.goodorbad;
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
        };

        console.log(observation);

        //Inserting the data into the observations table using a JSON array
        connection.get().query('INSERT INTO observations SET ?', [observation], function (err, result) {
            if (err) {
                req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                res.render('add-observation', {
                    behaviour: behaviour,
                    assignedTo: assignedTo,
                    assignedBy: assignedBy,
                    observationDate: observationDate,
                    observationType: observationType,
                    observationComment: observationComment,
                    message: req.flash('Our database servers maybe down, please try again')
                });
                return;
            }

            //Display a message in the console if the observation was successfully added
            console.log("Observation added");
            //req.flash('success_messages', 'The observation was successfully added to the database.');
            //res.locals.success_messages = req.flash('success_messages');
            //get all of the employees in the users table
            connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    res.render('observations', {
                        title: 'Observations',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                    return;
                }
                //Get all of the observations for each employee

                connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' +
                    'LEFT JOIN observations on users.t_number = observations.assigned_to ' +
                    'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', function (err, obsResults) {
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        res.render('observations', {
                            title: 'Observations',
                            message: req.flash('Our database servers maybe down.Please try again')
                        });
                        return;
                    }
                    //Render the observations page with the list of users and observations
                    /**
                     res.render('observations', {
                    title: 'Observations List',
                    users: userResults,
                    observations: obsResults
                });
                     **/
                    return res.redirect('/users/observations');


                });
            });

        });
    }
    //Display error message if a user has not selected an employee for the dropdown
    else {
        //get all of the employees in the users table
        connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
            if (err) {
                req.flash('Our database servers maybe down.Please try again',
                    'Our database servers maybe down.Please try again');
                res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down.Please try again')
                });
                return;
            }
            //Get all the behaviours and skills from db
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                    return;
                }
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        res.render('add-observation', {
                            title: 'Add Observation',
                            message: req.flash('Our database servers maybe down.Please try again')
                        });
                        return;
                    }

                    var skill = {
                        skill_title: undefined,
                        skill_id: undefined,
                    };

                    var behaviour = {
                        behaviour_desc: undefined,
                        behaviour_id: undefined,
                        skill_id: undefined
                    };
                    //Check if the user has selected an employee
                    if(req.body.employeeDropdown != undefined)
                    {
                        req.flash('Please select a behaviour type', 'Please select a behaviour type');
                        res.render('add-observation', {
                            title: 'Add Observation',
                            users: userResults,
                            skills: categoryResults,
                            behaviours: behaviourResults,
                            selectedEmployee: req.body.employeeDropdown,
                            message: req.flash('Please select a behaviour type')
                        });
                        return;
                    }
                    //Check if the user has selected a behaviour type
                    else {
                        req.flash('Please select an employee', 'Please select an employee');
                        res.render('add-observation', {
                            title: 'Add Observation',
                            users: userResults,
                            skills: categoryResults,
                            behaviours: behaviourResults,
                            message: req.flash('Please select an employee')
                        });
                        return;
                    }


                });

            });
        });

    }
});

//When the observation is submitted, this router.post gets triggered.  It takes the form values from the front-end page
//and inserts them into the observations table
router.post('/add-observation/:employee', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    if (!req.user.privileged) {
        return res.redirect('/users/');
    }
    if(req.body.goodorbad != undefined) {
        //Store form variables
        var behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
        //var skill_id = req.body.goodorbad.replace("bad","").replace("good","");
        var assignedTo = req.body.employeeDropdown;
        var assignedBy = req.user.t_number;
        var currentDate = getCurrentDate();
        var observationDate = currentDate;
        var observationType = req.body.goodorbad;
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
        };

        console.log(observation);

        //Inserting the data into the observations table using a JSON array
        connection.get().query('INSERT INTO observations SET ?', [observation], function (err, result) {
            if (err) {
                req.flash('Our database servers maybe down, please try again', 'Our database servers maybe down, please try again');
                res.render('add-observation', {
                    behaviour: behaviour,
                    assignedTo: assignedTo,
                    assignedBy: assignedBy,
                    observationDate: observationDate,
                    observationType: observationType,
                    observationComment: observationComment,
                    message: req.flash('Our database servers maybe down, please try again')
                });
                return;
            }

            //Display a message in the console if the observation was successfully added
            console.log("Observation added");
            //req.flash('success_messages', 'The observation was successfully added to the database.');
            //res.locals.success_messages = req.flash('success_messages');
            //get all of the employees in the users table
            connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    res.render('observations', {
                        title: 'Observations',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                    return;
                }
                //Get all of the observations for each employee

                connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' +
                    'LEFT JOIN observations on users.t_number = observations.assigned_to ' +
                    'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', function (err, obsResults) {
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        res.render('observations', {
                            title: 'Observations',
                            message: req.flash('Our database servers maybe down.Please try again')
                        });
                        return;
                    }
                    //Render the observations page with the list of users and observations
                    /**
                     res.render('observations', {
                    title: 'Observations List',
                    users: userResults,
                    observations: obsResults
                });
                     **/

                    return res.redirect('/users/observations');

                });
            });

        });
    }
    //Check if the user has selected a behaviour type
    else
    {
        //get all of the employees in the users table
        connection.get().query('SELECT first_name, last_name,t_number FROM users ', function (err, userResults) {
            if (err) {
                req.flash('Our database servers maybe down.Please try again',
                    'Our database servers maybe down.Please try again');
                res.render('add-observation', {
                    title: 'Add Observation',
                    message: req.flash('Our database servers maybe down.Please try again')
                });
                return;
            }
            //Get all the behaviours and skills from db
            connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills ', function (err, categoryResults) {
                if (err) {
                    req.flash('Our database servers maybe down.Please try again',
                        'Our database servers maybe down.Please try again');
                    res.render('add-observation', {
                        title: 'Add Observation',
                        message: req.flash('Our database servers maybe down.Please try again')
                    });
                    return;
                }
                connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
                    'JOIN skills on behaviours.skill_id = skills.skill_id', function (err, behaviourResults) {
                    if (err) {
                        req.flash('Our database servers maybe down.Please try again',
                            'Our database servers maybe down.Please try again');
                        res.render('add-observation', {
                            title: 'Add Observation',
                            message: req.flash('Our database servers maybe down.Please try again')
                        });
                        return;
                    }

                    var skill = {
                        skill_title: undefined,
                        skill_id: undefined,
                    };

                    var behaviour = {
                        behaviour_desc: undefined,
                        behaviour_id: undefined,
                        skill_id: undefined
                    };

                    req.flash('Please select a behaviour type', 'Please select a behaviour type');
                    res.render('add-observation', {
                        title: 'Add Observation',
                        users: userResults,
                        skills: categoryResults,
                        behaviours: behaviourResults,
                        employee: req.params.employee,
                        message: req.flash('Please select a behaviour type')
                    });
                    return;
                    });
                });
        });
    }
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

function getCurrentDate() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var today =  year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;

    return today;
}

//TODO:Convert t_number to name
function getAssignedBy(t_number){
    connection.get().query('SELECT first_name, last_name from users '+
    'WHERE t_number = ?', t_number, function (err, results) {
        if(err)
        {
            req.flash('Fail to Find User',
                'Fail to Find User');
            res.render('observations', {
                title: 'Observations',
                users: results,
                message: req.flash('Fail to Find User')});
            return;
        }
        var name = results[0].first_name;

        //The User was found
        return name;
    });
}

module.exports = router;

