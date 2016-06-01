/**
 * Created by Jacob on 2016-05-29.
 */
var express = require('express');
var connection = require('../../connection');
var passport = require('passport');

var behaviourModel = require('../../models/observation');

var router = express.Router();
// Get for behaviours and show them for each skill
router.get('/', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }

    var returnObj = {
        title: 'Behaviours'
    };

    //Display success message on adding observation
    if(req.session.success) {
        res.locals.success_messages = req.flash('success_messages');
        req.session.success = false;
    }

    //Connection to get all the skills
    connection.get().query('SELECT skill_id, skill_title FROM skills', function(err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('behaviours', returnObj);
        }

        //Connection to get all behaviours
        connection.get().query('SELECT skill_id, behaviour_id, behaviour_desc FROM behaviours', function(err, behaviourResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                //Render the page wth error messages
                return res.render('behaviours', returnObj);
            }

            returnObj['skills'] = skillResults;
            returnObj['behaviours'] = behaviourResults;
            //Render the observations page with the list of users and observations
            res.render('behaviours', returnObj);
        });
    });
});

router.get('/add-behaviour', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var returnObj = {
        title: 'Add Behaviour'
    };

    //Connection to get all behaviours
    connection.get().query('SELECT skill_id, skill_title FROM skills', function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('add-behaviour', returnObj);
        }

        returnObj['skills'] = skillResults;

        //Render the observations page with the list of skills and behaviours
        return res.render('add-behaviour', returnObj);
    });
});

// When the add-behaviour page is loaded, and there is a t_number is the url. Render the add behaviour page
router.get('/add-behaviour/:skill', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var returnObj = {
        title: 'Edit Skill/Behaviours'
    };

    //Connection to get all behaviours
    connection.get().query('SELECT skill_id, skill_title FROM skills', function(err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('add-behaviour', returnObj);
        }
        else {
            connection.get().query('SELECT skills.skill_id, skills.skill_title, behaviour_id, behaviours.behaviour_desc ' +
                'FROM skills INNER JOIN behaviours ON skills.skill_id = behaviours.skill_id ' +
                'WHERE skills.skill_id = ?', req.params.skill, function (err, behaviourResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('add-behaviour', returnObj);
                }
                else {
                    returnObj['skills'] = skillResults;
                    returnObj['selectedskill'] = behaviourResults;
                    //Render the observations page with the list of users and observations
                    return res.render('add-behaviour', returnObj);
                }
            });
        }
    });
});

// When the user has added a behaviour, update the database and return them to the behaviours page
router.post('/add-behaviour', ensureAuthenticated, function(req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var behaviours = req.body;
    var skillTitle = req.body.skillTitleBox;

    var returnObj = {
        title: 'Add Skills/Behaviours'
    };

    var skill = {
        skill_title: skillTitle
    };

    //Update the skill name
    connection.get().query('INSERT INTO skills SET ?', [skill], function(err, results) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('add-behaviour', returnObj);
        }
        else {
            connection.get().query('SELECT * FROM skills WHERE skill_title = ?', skillTitle, function(err, skillID) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('add-behaviour', returnObj);
                }
                //Update the behaviour description
                for(var aBehaviour in behaviours) {
                    if(!behaviours.hasOwnProperty(aBehaviour)) {
                        continue;
                    }

                    if(aBehaviour.indexOf('behaviourid') > -1) {
                        //Creating the JSON array to store the behaviour data
                        var behaviour = {
                            skill_id: skillID[0].skill_id,
                            behaviour_desc: behaviours[aBehaviour]
                        };

                        connection.get().query('INSERT INTO behaviours SET ?', [behaviour], function(err, skillResults) {
                            //If an error is thrown
                            if (err) {
                                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                //Render the page wth error messages
                                return res.render('add-behaviour', returnObj);
                            }
                        });
                    }
                }
                //If all is good, return them to the behaviours page
                req.flash('success_messages', 'The behaviour was successfully added to the database.');
                req.session.success = true;
                return res.redirect('/users/behaviours');
            });
        }
    });

});

// When the user has editted a behaviour, update the database and return them to the behaviours page
router.post('/add-behaviour/:skill', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var skillTitle = req.body.skillTitleBox;
    var behaviours = req.body;

    var returnObj = {
        title: 'Edit Skills/Behaviours'
    };

    //Update the skill name
    connection.get().query('UPDATE skills SET skill_title = ? WHERE skill_id = ?', [skillTitle, req.params.skill], function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('add-behaviour', returnObj);
        }
    });

    //Update the behaviour description
    for(var aBehaviour in behaviours) {
        if(!behaviours.hasOwnProperty(aBehaviour)) {
            continue;
        }

        if(aBehaviour.indexOf('behaviourid') > -1) {
            connection.get().query('UPDATE behaviours SET behaviour_desc = ? WHERE behaviour_id = ?', [behaviours[aBehaviour], aBehaviour.slice(-1)], function (err, skillResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('add-behaviour', returnObj);
                }
            });
        }
    }
    //If all is good, return them to the behaviours page
    req.flash('success_messages', 'The skill ' + skillTitle+ ' and behaviour(s) have been edited successfully.');
    req.session.success = true;
    return res.redirect('/users/behaviours');
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = router;