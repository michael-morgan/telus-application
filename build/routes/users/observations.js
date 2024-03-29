'use strict';

var _express = require('express');

var express = _interopRequireWildcard(_express);

var _connection = require('../../connection');

var connection = _interopRequireWildcard(_connection);

var _utility = require('../../utility');

var utility = _interopRequireWildcard(_utility);

var _passport = require('passport');

var passport = _interopRequireWildcard(_passport);

var _observation = require('../../models/observation');

var observationModel = _interopRequireWildcard(_observation);

var _user = require('../../models/user');

var userModel = _interopRequireWildcard(_user);

var _store = require('../../models/store');

var storeModel = _interopRequireWildcard(_store);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var router = express.Router();

// Get for observations when the page is loaded, show the observations for each user
router.get('/', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var stores = {
        store_id: undefined,
        store_name: undefined
    };

    var returnObj = {
        title: 'Observations'
    };

    //Display success message on adding observation
    if (req.session.success) {
        req.flash('success_messages', 'Observation successfully added!');
        res.locals.success_messages = req.flash('success_messages');
        req.session.success = false;
    }

    //Check if the current logged in user is a manager
    connection.get().query('SELECT stores.store_id, store_name, users.t_number FROM stores ' + 'INNER JOIN stores_util ON stores.store_id = stores_util.store_id ' + 'INNER JOIN users ON stores_util.t_number = users.t_number ' + 'WHERE users.t_number = ? AND stores.store_id = ? GROUP BY stores.store_id', [req.user.t_number, req.session.store_id], function (err, storesResults) {
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('observations/observations', returnObj);
        }

        //Connection to get all the employees
        if (req.user.privileged >= 2) {
            connection.get().query('SELECT first_name, last_name, users.t_number, store_id FROM users ' + 'INNER JOIN stores_util ON users.t_number = stores_util.t_number GROUP BY users.t_number', function (err, userResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/observations', returnObj);
                }

                //Connection to get all of the observations for each employee ordered by date
                getAllObservations(function (err, obsResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('observations/observations', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['observations'] = obsResults;
                    returnObj['stores'] = storesResults;

                    returnObj['obsObj'] = JSON.stringify(returnObj);
                    //Render the observations page with the list of users and observations
                    res.render('observations/observations', returnObj);
                });
            });
        } else {
            connection.get().query('SELECT first_name, last_name, users.t_number, store_id FROM users ' + 'INNER JOIN stores_util ON users.t_number = stores_util.t_number' + 'WHERE users.t_number = ? GROUP BY users.t_number', req.user.t_number, function (err, userResults) {

                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/observations', returnObj);
                }

                //Connection to get all of the observations for each employee ordered by date
                getAllObservations(function (err, obsResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('observations', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['observations'] = obsResults;
                    returnObj['stores'] = storesResults;

                    returnObj['obsObj'] = JSON.stringify(returnObj);

                    //Render the observations page with the list of users and observations
                    res.render('observations/observations', returnObj);
                });
            });
        }
    });
});

// When the add-observation page is loaded, render the add observations page
router.get('/add-observation', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var returnObj = {
        title: 'Add Observation'
    };

    if (req.user.privileged >= 2) {

        //Connection to get all of the employees in the users table
        storeModel.getUsersByStoreId(req.session.store_id, function (err, userResults) {
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills(function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again';
                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the  behaviours table
                getAllBehaviours(function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page with error messages
                        return res.render('observations/add-observation', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] = behaviourResults;

                    //Render the page with the DB results
                    res.render('observations/add-observation', returnObj);
                });
            });
        });
    } else {
        //Connection to get all of the employees in the users table
        userModel.getById(req.user.t_number, function (err, userResults) {
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills(function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the  behaviours table
                getAllBehaviours(function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page with error messages
                        return res.render('observations/add-observation', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] = behaviourResults;

                    //Render the page with the DB results
                    res.render('observations/add-observation', returnObj);
                });
            });
        });
    }
});

// When the add-observation page is loaded, and there is a t_number is the url. Render the add observations page
router.get('/add-observation/:employee', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var returnObj = {
        title: 'Add Observation'
    };

    if (req.user.privileged >= 2) {
        //Connection to get all of the employees in the users table
        storeModel.getUsersByStoreId(req.session.store_id, function (err, userResults) {
            //If an error is thrown
            if (err) {
                //Render the page wth error messages
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills(function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    //Render the page wth error messages
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the behaviours table
                getAllBehaviours(function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        //Render the page wth error messages
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        return res.render('observations/add-observation', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] = behaviourResults;
                    returnObj['employee'] = req.params.employee;

                    //Render the page with the query results
                    return res.render('observations/add-observation', returnObj);
                });
            });
        });
    } else {
        userModel.getById(req.user.t_number, function (err, userResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills(function (err, categoryResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the behaviours table
                getAllBehaviours(function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        return res.render('observations/add-observation', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] = behaviourResults;
                    returnObj['employee'] = req.params.employee;

                    //Render the page with the query results
                    return res.render('observations/add-observation', returnObj);
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

    var returnObj = {
        title: 'Observations'
    };

    //Check that the user has selected an employee
    if (req.body.employeeDropdown != undefined && req.body.goodorbad != undefined) {
        (function () {
            //Store form variables
            var behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
            var assignedTo = req.body.employeeDropdown;
            var assignedBy = req.user.t_number;
            var observationDate = utility.currentDate();
            var observationType = req.body.goodorbad;

            //Assign observationType
            if (observationType.indexOf("good") != -1) {
                observationType = "1";
            } else {
                observationType = "0";
            }

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

            //Inserting the data into the observations table using a JSON array
            observationModel.create(observation, function (err, result) {
                //If an error is thrown
                if (err) {
                    //Render the page wth error messages
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    returnObj['behaviour'] = behaviour;
                    returnObj['assignedTo'] = assignedTo;
                    returnObj['assignedBy'] = assignedBy;
                    returnObj['observationDate'] = observationDate;
                    returnObj['observationType'] = observationType;
                    returnObj['observationComment'] = observationComment;

                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj); //End render
                } //End if
                req.flash('success_messages', 'Observation successfully added!');
                res.locals.success_messages = req.flash('success_messages');

                //Connection to get all of the employees in the users table
                connection.get().query('SELECT first_name, last_name, t_number FROM users', function (err, userResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('observations/observations', returnObj); //End render
                    } //End if

                    //Get all of the observations for each employee
                    connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, ' + 'observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' + 'LEFT JOIN observations on users.t_number = observations.assigned_to ' + 'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' + 'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', function (err, obsResults) {
                        //If an error is thrown
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        if (err) {
                            //Render the page wth error messages
                            return res.render('observations/observations', returnObj); //End render
                        } //End if
                        req.session.success = true;
                        return res.redirect('/users/observations');
                    }); //End connection for observations for each employee
                }); //End connection for users
            });
        })();
    } else {
        returnObj['title'] = 'Add Observation';
        //Connection to get all of the employees in the users table
        userModel.getAll(function (err, userResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                //Render the page wth error messages
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills(function (err, categoryResults) {
                //if an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the behaviours table
                getAllBehaviours(function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('observations/add-observation', returnObj);
                    }

                    //JSON array to hold behaviour info
                    var behaviour = {
                        behaviour_desc: undefined,
                        behaviour_id: undefined,
                        skill_id: undefined
                    };

                    //Check if the user has selected an employee
                    if (req.body.employeeDropdown != undefined) {
                        returnObj['message'] = 'Please select a behaviour type';
                        returnObj['users'] = userResults;
                        returnObj['skills'] = categoryResults;
                        returnObj['behaviours'] = behaviourResults;
                        returnObj['selectedEmployee'] = req.body.employeeDropdown;

                        //Render the page wth error messages
                        return res.render('observations/add-observation', returnObj);
                    }

                    //Check if the user has selected a behaviour type
                    else {
                            returnObj['message'] = 'Please select an employee';
                            returnObj['users'] = userResults;
                            returnObj['skills'] = categoryResults;
                            returnObj['behaviours'] = behaviourResults;
                            return res.render('observations/add-observation', returnObj);
                        }
                });
            });
        });
    }
});

/**
 * When the observation is submitted, this router.post gets triggered. It takes the form values from the front-end page and inserts them into the observations table
 * This method is called when there is an t_number in the url
 */
router.post('/add-observation/:employee', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var returnObj = {
        title: 'Observations'
    };

    //Check that the user has selected an employee
    if (req.body.employeeDropdown != undefined && req.body.goodorbad != undefined) {
        (function () {
            //Store form variables
            var behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
            var assignedTo = req.body.employeeDropdown;
            var assignedBy = req.user.t_number;
            var observationDate = utility.currentDate();
            var observationType = req.body.goodorbad;

            //Assign observationType
            if (observationType.indexOf("good") != -1) {
                observationType = "1";
            } else {
                observationType = "0";
            }

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

            utility.log({ type: 'log', message: observation });

            //Inserting the data into the observations table using a JSON array
            observationModel.create(observation, function (err, result) {
                //If an error is thrown
                if (err) {
                    //Render the page wth error messages
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    returnObj['behaviour'] = behaviour;
                    returnObj['assignedTo'] = assignedTo;
                    returnObj['assignedBy'] = assignedBy;
                    returnObj['observationDate'] = observationDate;
                    returnObj['observationType'] = observationType;
                    returnObj['observationComment'] = observationComment;

                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj); //End render
                    //Render the page wth error messages
                }

                req.flash('success_messages', 'The observation was successfully added to the database.');
                res.locals.success_messages = req.flash('success_messages');

                //Connection to get all of the employees in the users table
                selectAllUsers(function (err, userResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('observations/observations', returnObj); //End render
                    }

                    //Get all of the observations for each employee
                    connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, ' + 'observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' + 'LEFT JOIN observations on users.t_number = observations.assigned_to ' + 'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' + 'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', function (err, obsResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('observations/observations', returnObj); //End render
                        } //end if

                        req.session.success = true;
                        return res.redirect('/users/observations');
                    });
                });
            });
        })();
    }

    //Display error message if a user has not selected an employee for the dropdown
    else {
            returnObj['title'] = 'Add Observation';
            //Connection to get all of the employees in the users table
            selectAllUsers(function (err, userResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj);
                } //End if

                //Get all the skills from the skills table
                getAllSkills(function (err, categoryResults) {
                    //if an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('observations/add-observation', returnObj);
                    } //End if

                    //Connection to get the behaviours from the behaviours table
                    getAllBehaviours(function (err, behaviourResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('observations/add-observation', returnObj);
                        } //End if

                        //JSON array to hold behaviour info
                        var behaviour = {
                            behaviour_desc: undefined,
                            behaviour_id: undefined,
                            skill_id: undefined
                        }; //End behaviour

                        //Check if the user has selected an employee
                        if (req.body.employeeDropdown != undefined) {
                            returnObj['message'] = req.flash('Please select a behaviour type');
                            returnObj['users'] = userResults;
                            returnObj['skills'] = categoryResults;
                            returnObj['behaviours'] = behaviourResults;
                            returnObj['selectedEmployee'] = req.body.employeeDropdown;

                            //Render the page wth error messages
                            return res.render('observations/add-observation', returnObj);
                        } //End if

                        //Check if the user has selected a behaviour type
                        else {
                                returnObj['message'] = req.flash('Please select an employee');
                                returnObj['users'] = userResults;
                                returnObj['skills'] = categoryResults;
                                returnObj['behaviours'] = behaviourResults;
                                return res.render('observations/add-observation', returnObj);
                            }
                    });
                });
            });
        }
});

router.post('/remove', ensureAuthenticated, function (req, res, next) {
    var observationId = req.body.id;
    observationModel.deleteById(observationId, function (err, result) {
        if (err) {
            utility.log({ type: 'error', message: 'Error deleting observation_id ' + observationId });
            return res.end('Error: ' + err.message);
        }

        utility.log({ type: 'log', message: 'Removing observation ' + observationId });
        res.send(observationId);
    });
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

//Select all users in the db
function selectAllUsers(callback) {
    connection.get().query('SELECT * FROM users WHERE privileged != 4', function (err, rows) {
        if (err) {
            callback(err, null);
        } else callback(null, rows);
    });
}

//Select all observations and order them in a descending order
function getAllObservations(callback) {
    connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment, observations.observation_date , ' + 'observations.assigned_by, ASSIGNED_BY_STATEMENT.full_name AS assigned_by_name, observations.observation_type FROM users ' + 'INNER JOIN observations on users.t_number = observations.assigned_to ' + 'INNER JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' + 'INNER JOIN skills on behaviours.skill_id = skills.skill_id ' + 'INNER JOIN (SELECT users.t_number AS assigned_by, observations.assigned_to AS assigned_to, CONCAT(users.first_name, " ", users.last_name) AS full_name FROM users ' + 'INNER JOIN observations on users.t_number = observations.assigned_by) as ASSIGNED_BY_STATEMENT on observations.assigned_by = ASSIGNED_BY_STATEMENT.assigned_by ' + 'GROUP BY observations.observation_id ORDER BY observations.observation_date DESC ', function (err, rows) {
        if (err) {
            callback(err, null);
        } else callback(null, rows);
    });
}

//Select all skills in the db
function getAllSkills(callback) {
    connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills', function (err, rows) {
        if (err) {
            callback(err, null);
        } else callback(null, rows);
    });
}

//Select all behaviours in the db
function getAllBehaviours(callback) {
    connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' + 'JOIN skills ON behaviours.skill_id = skills.skill_id', function (err, rows) {
        if (err) {
            callback(err, null);
        } else callback(null, rows);
    });
}

module.exports = router;

//# sourceMappingURL=observations.js.map