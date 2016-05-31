/**
 * Created by Jacob on 2016-05-29.
 */
var express = require('express');
var connection = require('../../connection');
var passport = require('passport');

var async = require('async');

var behaviourModel = require('../../models/observation');

var router = express.Router();
// Get for behaviours and show them for each skill
router.get('/', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }

    var returnObj = {
        title: 'Behaviours'
    };

    //Display success message on adding observation
    if(req.session.success)
    {
        res.locals.success_messages = req.flash('success_messages');
        req.session.success = false;
    }

    //Connection to get all the skills
    connection.get().query('SELECT skill_id,skill_title FROM skills', function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('behaviours', returnObj);
        }

        //Connection to get all behaviours
        connection.get().query('SELECT skill_id,behaviour_id,behaviour_desc FROM behaviours', function (err, behaviourResults) {
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
router.get('/add-behaviour', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }

    var returnObj = {
        title: 'Add Skills/Behaviours'
    };
    //Connection to get all behaviours
    connection.get().query('SELECT skill_id,skill_title FROM skills', function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('add-behaviour', returnObj);
        }

        //Render the observations page with the list of users and observations
        return res.render('add-behaviour', returnObj);
    });
});

// When the add-observation page is loaded, and there is a t_number is the url. Render the add observations page
router.get('/add-behaviour/:skill', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }

    var returnObj = {
        title: 'Edit Skills/Behaviours'
    };
    //Connection to get all behaviours
    connection.get().query('SELECT skill_id,skill_title FROM skills', function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('add-behaviour', returnObj);
        }
        else {
            connection.get().query('SELECT skills.skill_id,skills.skill_title,behaviour_id,behaviours.behaviour_desc FROM skills INNER JOIN behaviours ON skills.skill_id = behaviours.skill_id ' +
                'WHERE skills.skill_id = ?', req.params.skill, function (err, behaviourResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('add-behaviour', returnObj);
                }
                else {
                    returnObj['selectedskill'] = behaviourResults;
                    //Render the observations page with the list of users and observations
                    return res.render('add-behaviour', returnObj);
                }
            });
        }
    });
});
// When the user has added a behaviour, update the database and return them to the behaviours page
router.post('/add-behaviour', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    var behaviours = req.body;
    var skillTitle = req.body.skillid1;
    var skillID = '';
    var behaviourDesc = '';
    var num = "";
    var returnObj = {
        title: 'Add Skills/Behaviours'
    };
    //Filter our the info we dont need, all we want is the skill and behaviour textareas
    async.forEach(Object.keys(behaviours), function (aBehaviour, callback){
        if (aBehaviour.indexOf('skillid') == -1 && aBehaviour.indexOf('behaviourid') == -1)
        {
            delete behaviours[aBehaviour];
        }
        if(behaviours[aBehaviour] != undefined)
        {
            if (aBehaviour.indexOf('skillid') > -1) {
                if (behaviours[aBehaviour] == null || behaviours[aBehaviour] == "") {
                    returnObj['message'] = 'One of the skills was empty, please enter a skill name';
                    //Render the page wth error messages
                    return res.render('add-behaviour', returnObj);
                }
                //Regex to extract numbers from textarea id
                skillTitle = behaviours[aBehaviour];
                num = String(skillTitle.match(/[0-9]+/g));
                connection.get().query('SELECT skill_id FROM skills WHERE skill_id = ?', num, function (err, skillResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('add-behaviour', returnObj);
                    }
                    //Add Behaviour
                    //Creating the JSON array to store the behaviour data
                    var skill = {
                        skill_title: skillTitle
                    }; //End behaviour
                    connection.get().query('INSERT INTO skills SET ?', [skill], function (err, skillResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = 'Our database servers maybe down. Please try again.';
                            //Render the page wth error messages
                            return res.render('add-behaviour', returnObj);
                        }
                        else {
                            skillID = skillResults.insertId;
                            async.forEach(Object.keys(behaviours), function (aBehaviour, secondCallback){
                                if (aBehaviour.indexOf('behaviourid') > -1) {
                                    behaviourDesc = behaviours[aBehaviour];
                                    if (skillID != '') {
                                        var behaviour = {
                                            skill_id: skillID,
                                            behaviour_desc: behaviourDesc
                                        }; //End behaviour
                                        connection.get().query('INSERT INTO behaviours SET ?', [behaviour], function (err, skillResults) {
                                            //If an error is thrown
                                            if (err) {
                                                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                                //Render the page wth error messages
                                                return res.render('add-behaviour', returnObj);
                                            }
                                        });
                                    }
                                }
                                secondCallback();// tell async that the iterator has completed
                            }, function(err) {
                            });
                            callback();// tell async that the iterator has completed
                        }

                    });
                });
            }
        }
    }, function(err) {
    });
     //Update the behaviour description
     //If all is good, return them to the behaviours page
                req.flash('success_messages', 'The behaviour was successfully added to the database.');
                req.session.success = true;
                return res.redirect('/users/behaviours');
});
// When the user has edited a behaviour, update the database and return them to the behaviours page
router.post('/add-behaviour/:skill', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    var behaviours = req.body;
    var skillTitle = req.body.skillTitleBox;
    var behaviourDesc = '';
    var num = '';
    var returnObj = {
        title: 'Edit Skills/Behaviours'
    };
    //Update the skill name
    connection.get().query('UPDATE skills SET skill_title = ? WHERE skill_id = ?',[skillTitle,req.params.skill], function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('add-behaviour', returnObj);
        }
    });
    for(var aBehaviour in behaviours)
    {
        //Update the behaviour description
         if(aBehaviour.indexOf('behaviourid') > -1)
            {
                console.log(aBehaviour);
                if(behaviours[aBehaviour] == null || behaviours[aBehaviour] == "")
                {
                    returnObj['message'] = 'One of the behaviours was empty, please enter a behaviour description';
                    //Render the page wth error messages
                    return res.render('add-behaviour', returnObj);
                }
                behaviourDesc = behaviours[aBehaviour];
                //Regex to extract numbers from textarea id
                num = String(aBehaviour.match(/[0-9]+/g));

                connection.get().query('SELECT behaviour_id FROM behaviours WHERE behaviour_id = ?',num, function (err, behaviourResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('add-behaviour', returnObj);
                    }
                    //Add Behaviour

                    else if(behaviourResults.length <= 0)
                    {
                        //Creating the JSON array to store the behaviour data
                        var behaviour = {
                            skill_id: req.params.skill,
                            behaviour_desc: behaviourDesc
                        }; //End behaviour
                        connection.get().query('INSERT INTO behaviours SET ?',[behaviour], function (err, skillResults) {
                            //If an error is thrown
                            if (err) {
                                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                //Render the page wth error messages
                                return res.render('add-behaviour', returnObj);
                            }
                        });
                    }
                });
                //Update Behaviour
                        connection.get().query('UPDATE behaviours SET behaviour_desc = ? WHERE behaviour_id = ?',[behaviourDesc,num], function (err, skillResults) {
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