import * as express from 'express';
import * as connection from '../../connection';
import * as utility from '../../utility';
import * as passport from 'passport';

import * as observationModel from '../../models/observation';
import * as userModel from '../../models/user';
import * as storeModel from '../../models/store';

let router = express.Router();

// Get for observations when the page is loaded, show the observations for each user
router.get('/', ensureAuthenticated, (req, res, next) => {
    if (!req.body) { return res.sendStatus(400); }

    let stores = {
        store_id: undefined,
        store_name: undefined
    };

    let returnObj = {
        title: 'Observations'
    };

    //Display success message on adding observation
    if(req.session.success) {
        req.flash('success_messages', 'Observation successfully added!');
        res.locals.success_messages = req.flash('success_messages');
        req.session.success = false;
    }

    //Check if the current logged in user is a manager
    connection.get().query('SELECT stores.store_id, store_name, users.t_number FROM stores ' +
        'INNER JOIN stores_util ON stores.store_id = stores_util.store_id ' +
        'INNER JOIN users ON stores_util.t_number = users.t_number ' +
        'WHERE users.t_number = ? AND stores.store_id = ? GROUP BY stores.store_id', [req.user.t_number, req.session.store_id], (err, storesResults) => {
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('observations/observations', returnObj);
        }

        //Connection to get all the employees
        if(req.user.privileged >= 2) {
            connection.get().query('SELECT first_name, last_name, users.t_number, store_id FROM users ' +
                'INNER JOIN stores_util ON users.t_number = stores_util.t_number GROUP BY users.t_number', (err, userResults) => {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/observations', returnObj);
                }

                //Connection to get all of the observations for each employee ordered by date
                getAllObservations((err, obsResults) => {
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
        }
        else {
            connection.get().query('SELECT first_name, last_name, users.t_number, store_id FROM users ' +
                'INNER JOIN stores_util ON users.t_number = stores_util.t_number' +
                'WHERE users.t_number = ? GROUP BY users.t_number', req.user.t_number, (err, userResults) => {

                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/observations', returnObj);
                }

                //Connection to get all of the observations for each employee ordered by date
                getAllObservations((err, obsResults) => {
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
router.get('/add-observation', ensureAuthenticated, (req, res, next) => {
    if (!req.body) { return res.sendStatus(400); }

    let returnObj = {
        title: 'Add Observation'
    };

    if(req.user.privileged >= 2) {

        //Connection to get all of the employees in the users table
        storeModel.getUsersByStoreId(req.session.store_id, (err, userResults) => {
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills((err, categoryResults) => {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again';
                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the  behaviours table
                getAllBehaviours((err, behaviourResults) => {
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
    else {
        //Connection to get all of the employees in the users table
        userModel.getById(req.user.t_number, (err, userResults) => {
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills((err, categoryResults) => {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the  behaviours table
                getAllBehaviours((err, behaviourResults) => {
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
router.get('/add-observation/:employee', ensureAuthenticated, (req, res, next) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    let returnObj = {
        title: 'Add Observation'
    };

    if(req.user.privileged >= 2) {
        //Connection to get all of the employees in the users table
        storeModel.getUsersByStoreId(req.session.store_id, (err, userResults) => {
            //If an error is thrown
            if (err) {
                //Render the page wth error messages
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills((err, categoryResults) => {
                //If an error is thrown
                if (err) {
                    //Render the page wth error messages
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the behaviours table
                getAllBehaviours((err, behaviourResults) => {
                    //If an error is thrown
                    if (err) {
                        //Render the page wth error messages
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        return res.render('observations/add-observation', returnObj);
                    }

                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] =  behaviourResults;
                    returnObj['employee'] = req.params.employee;

                    //Render the page with the query results
                    return res.render('observations/add-observation', returnObj);
                });
            });
        });
    }
    else {
        userModel.getById(req.user.t_number, (err, userResults) => {
            //If an error is thrown
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills((err, categoryResults) => {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    return res.render('observations/add-observation', returnObj);
                }

                //Connection to get the behaviours from the behaviours table
                getAllBehaviours((err, behaviourResults) => {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        return res.render('observations/add-observation', returnObj);
                    }


                    returnObj['users'] = userResults;
                    returnObj['skills'] = categoryResults;
                    returnObj['behaviours'] =  behaviourResults;
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
router.post('/add-observation', ensureAuthenticated, (req, res, next) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    let returnObj = {
        title: 'Observations'
    };

    //Check that the user has selected an employee
    if (req.body.employeeDropdown != undefined && req.body.goodorbad != undefined) {
        //Store form variables
        let behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
        let assignedTo = req.body.employeeDropdown;
        let assignedBy = req.user.t_number;
        let observationDate = utility.currentDate();
        let observationType = req.body.goodorbad;

        //Assign observationType
        if (observationType.indexOf("good") != -1) {
            observationType = "1";
        }
        else {
            observationType = "0";
        }

        let observationComment = req.body.commentBox;

        //Creating the JSON array to store the observation data
        let observation = {
            behaviour_id: behaviour,
            assigned_to: assignedTo,
            assigned_by: assignedBy,
            observation_date: observationDate,
            observation_type: observationType,
            observation_comment: observationComment
        }; //End observation

        //Inserting the data into the observations table using a JSON array
        observationModel.create(observation, (err, result) => {
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
            connection.get().query('SELECT first_name, last_name, t_number FROM users', (err, userResults) => {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/observations',returnObj); //End render
                } //End if

                //Get all of the observations for each employee
                connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, ' +
                    'observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' +
                    'LEFT JOIN observations on users.t_number = observations.assigned_to ' +
                    'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', (err, obsResults) => {
                    //If an error is thrown
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    if(err)
                    {
                        //Render the page wth error messages
                        return res.render('observations/observations',returnObj); //End render

                    } //End if
                    req.session.success = true;
                    return res.redirect('/users/observations');
                }); //End connection for observations for each employee
            }); //End connection for users
        });
    }
    else {
        returnObj['title'] = 'Add Observation';
        //Connection to get all of the employees in the users table
        userModel.getAll((err, userResults) => {
            //If an error is thrown
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                //Render the page wth error messages
                return res.render('observations/add-observation', returnObj);
            }

            //Get all the skills from the skills table
            getAllSkills((err, categoryResults) => {
                //if an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('observations/add-observation',returnObj);
                }

                //Connection to get the behaviours from the behaviours table
                getAllBehaviours((err, behaviourResults) => {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('observations/add-observation',returnObj);
                    }

                    //JSON array to hold behaviour info
                    let behaviour = {
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
router.post('/add-observation/:employee', ensureAuthenticated, (req, res, next) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    let returnObj = {
        title: 'Observations'
    };

    //Check that the user has selected an employee
    if (req.body.employeeDropdown != undefined && req.body.goodorbad != undefined) {
        //Store form variables
        let behaviour = req.body.goodorbad.replace("bad", "").replace("good", "");
        let assignedTo = req.body.employeeDropdown;
        let assignedBy = req.user.t_number;
        let observationDate = utility.currentDate();
        let observationType = req.body.goodorbad;

        //Assign observationType
        if (observationType.indexOf("good") != -1) {
            observationType = "1";
        }
        else {
            observationType = "0";
        }

        let observationComment = req.body.commentBox;

        //Creating the JSON array to store the observation data
        let observation = {
            behaviour_id: behaviour,
            assigned_to: assignedTo,
            assigned_by: assignedBy,
            observation_date: observationDate,
            observation_type: observationType,
            observation_comment: observationComment
        };

        utility.log({ type: 'log', message: observation });

        //Inserting the data into the observations table using a JSON array
        observationModel.create(observation, (err, result) => {
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
            selectAllUsers((err, userResults) => {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('observations/observations',returnObj); //End render
                }

                //Get all of the observations for each employee
                connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, ' +
                    'observations.observation_comment , observations.observation_date , observations.assigned_by FROM users ' +
                    'LEFT JOIN observations on users.t_number = observations.assigned_to ' +
                    'LEFT JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
                    'LEFT JOIN skills on behaviours.skill_id = skills.skill_id', (err, obsResults) => {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('observations/observations',returnObj); //End render
                    } //end if

                    req.session.success = true;
                    return res.redirect('/users/observations');
                });
            });
        });

    }

    //Display error message if a user has not selected an employee for the dropdown
    else {
        returnObj['title'] = 'Add Observation';
        //Connection to get all of the employees in the users table
        selectAllUsers((err, userResults) => {
            //If an error is thrown
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                return res.render('observations/add-observation',returnObj);
            } //End if

            //Get all the skills from the skills table
            getAllSkills((err, categoryResults) => {
                //if an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('observations/add-observation',returnObj);
                } //End if

                //Connection to get the behaviours from the behaviours table
                getAllBehaviours((err, behaviourResults) => {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('observations/add-observation',returnObj);
                    } //End if

                    //JSON array to hold behaviour info
                    let behaviour = {
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

router.post('/remove', ensureAuthenticated, (req, res, next) => {
    let observationId = req.body.id;
    observationModel.deleteById(observationId, (err, result) => {
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
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

//Select all users in the db
function selectAllUsers(callback) {
    connection.get().query('SELECT * FROM users WHERE privileged != 4', (err, rows) => {
        if (err) {
            callback(err, null);
        } else
            callback(null, rows);
    });
}


//Select all observations and order them in a descending order
function getAllObservations(callback) {
    connection.get().query('SELECT users.t_number, behaviour_desc, observations.observation_id, skills.skill_title, observations.observation_comment, observations.observation_date , ' +
        'observations.assigned_by, ASSIGNED_BY_STATEMENT.full_name AS assigned_by_name, observations.observation_type FROM users ' +
        'INNER JOIN observations on users.t_number = observations.assigned_to ' +
        'INNER JOIN behaviours on observations.behaviour_id = behaviours.behaviour_id ' +
        'INNER JOIN skills on behaviours.skill_id = skills.skill_id ' +
        'INNER JOIN (SELECT users.t_number AS assigned_by, observations.assigned_to AS assigned_to, CONCAT(users.first_name, " ", users.last_name) AS full_name FROM users ' +
        'INNER JOIN observations on users.t_number = observations.assigned_by) as ASSIGNED_BY_STATEMENT on observations.assigned_by = ASSIGNED_BY_STATEMENT.assigned_by ' +
        'GROUP BY observations.observation_id ORDER BY observations.observation_date DESC ', (err, rows) => {
        if (err) {
            callback(err, null);
        } else
            callback(null, rows);
    });
}

//Select all skills in the db
function getAllSkills(callback) {
    connection.get().query('SELECT skills.skill_title, skills.skill_id FROM skills', (err, rows) => {
        if (err) {
            callback(err, null);
        } else
            callback(null, rows);
    });
}

//Select all behaviours in the db
function getAllBehaviours(callback) {
    connection.get().query('SELECT behaviours.behaviour_desc, behaviour_id, skills.skill_id FROM behaviours ' +
        'JOIN skills ON behaviours.skill_id = skills.skill_id', (err, rows) => {
        if (err) {
            callback(err, null);
        } else
            callback(null, rows);
    });
}

module.exports = router;