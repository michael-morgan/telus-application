/**
 * Created by Jacob on 2016-05-29.
 */
var express = require('express');
var connection = require('../../connection');
var passport = require('passport');
var async = require('async');

var behaviourModel = require('../../models/observation');
var returnObj = {};
var router = express.Router();

// Get for behaviours and show them for each skill
router.get('/', ensureAuthenticated, function (req, res, next) {
    //Ensure user is logged in
    if (req.user.privileged <= 2) { return res.redirect('/users/'); }

    if (!req.body) { return res.sendStatus(400); }

    returnObj['title'] = 'Behaviours';

    //Display success message on adding,editing or remove a behaviour/skill
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
            return res.render('behaviours/behaviours', returnObj);
        }

        //Connection to get all behaviours
        connection.get().query('SELECT skill_id,behaviour_id,behaviour_desc FROM behaviours', function (err, behaviourResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                //Render the page wth error messages
                return res.render('behaviours/behaviours', returnObj);
            }

            returnObj['skills'] = skillResults;
            returnObj['behaviours'] = behaviourResults;
            //Render the behaviours page with a list of behaviours and skills
            res.render('behaviours/behaviours', returnObj);
        });
    });
});
//Display the add behaviour page, you can edit and remove behaviours here as well
router.get('/add-behaviour', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    if (!req.body) {
        return res.sendStatus(400);
    }

    var returnObj = {
        title :'Add Behaviour'
    };
    //Connection to get all skills
    connection.get().query('SELECT skill_id,skill_title FROM skills', function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('behaviours/add-behaviour', returnObj);
        }
        //We are not removing a skill in this case
        returnObj['canRemove'] = undefined;
        //Render the add-behaviour page with an interface to perform CRUD
        return res.render('behaviours/add-behaviour', returnObj);
    });
});

// When the add-behaviour page is loaded, and there is a skill id in the url.
router.get('/add-behaviour/:skill', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    if (!req.body) { return res.sendStatus(400); }

    returnObj['title'] ='Edit Skills/Behaviours';
    //Connection to get all skills
    connection.get().query('SELECT skill_id,skill_title FROM skills', function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('behaviours/add-behaviour', returnObj);
        }
        else {
            //Get the skill id we are working with by using the skill parameter in the URL
            connection.get().query('SELECT skills.skill_id,skills.skill_title,behaviour_id,behaviours.behaviour_desc FROM skills INNER JOIN behaviours ON skills.skill_id = behaviours.skill_id ' +
                'WHERE skills.skill_id = ?', req.params.skill, function (err, behaviourResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('behaviours/add-behaviour', returnObj);
                }
                //No errors render the add-behaviour page
                else {
                    //We are not removing a skill in this case
                    returnObj['canRemove'] = undefined;
                    returnObj['selectedskill'] = behaviourResults;
                    return res.render('behaviours/add-behaviour', returnObj);
                }
            });
        }
    });
});

// When the add-behaviour page is loaded, and there is a skill id in the url and the user clicked Remove skill
router.get('/add-behaviour/:skill/:canRemove', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    if (!req.body) { return res.sendStatus(400); }

    returnObj['title'] ='Edit Skills/Behaviours';
    //Connection to get all skills
    connection.get().query('SELECT skill_id,skill_title FROM skills', function (err, skillResults) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = 'Our database servers maybe down. Please try again.';
            //Render the page wth error messages
            return res.render('behaviours/add-behaviour', returnObj);
        }
        else {
            //Get the skill we are working with
            connection.get().query('SELECT skills.skill_id,skills.skill_title,behaviour_id,behaviours.behaviour_desc FROM skills INNER JOIN behaviours ON skills.skill_id = behaviours.skill_id ' +
                'WHERE skills.skill_id = ?', req.params.skill, function (err, behaviourResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('behaviours/add-behaviour', returnObj);
                }
                //If all is well, render the add behaviour page and pass a remove parameter to automatically open the delete interface
                else {
                    returnObj['selectedskill'] = behaviourResults;
                    returnObj['canRemove'] = req.params.canRemove;
                    return res.render('behaviours/add-behaviour', returnObj);
                }
            });
        }
    });
});
// When we submit the add behaviour page with a skill and a remove parameter
router.post('/add-behaviour/:skill/:canRemove', ensureAuthenticated, function (req, res, next) {

    if (!req.body) { return res.sendStatus(400); }
    //Store variables from the submitted form
    var behaviours = req.body;
    var skillTitle = req.body.skillTitleBox;
    var behaviourDesc = '';
    var num = '';
    returnObj['title'] ='Edit Skills/Behaviours';
    var behaviourAdded = false;
    var behaviourDeleted = false;
    var skillDeleted = false;
    //Execute these functions in series, that is 1 after the other
    async.series([
        filterPostData,
        deleteSkills,
        deleteBehaviours,
        updateSkill,
        updateBehaviour,
        redirectUser
    ], function(err, results){
    });
    //Filter submitted data
    function filterPostData(fnCallback) {
        async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
            if (aBehaviour.indexOf('skillid') == -1 && aBehaviour.indexOf('behaviourid') == -1 && aBehaviour.indexOf('deletebehaviourid') == -1 && aBehaviour.indexOf('deleteskillid') == -1) {
                delete behaviours[aBehaviour];
            }
            callback(null);
        }, fnCallback);
    }
    //Check to see if we are deleting any skills
    function deleteSkills(fnCallback) {
        async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
            //Delete Skill
            if (aBehaviour.indexOf('deleteskillid') > -1) {
                var skillToDelete = aBehaviour;
                var skillID = String(skillToDelete.match(/[0-9]+/g));
                connection.get().query('DELETE FROM skills WHERE skill_id = ?', [skillID], function (err, skillResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('behaviours/add-behaviour', returnObj);
                    }
                    else {
                        behaviourDeleted = true;
                        skillDeleted = true;
                        fnCallback(null);
                    }
                });
            }
            else
            {
                callback(null);
            }
        }, fnCallback);
    }
    //Check to see if we are deleting any behaviours
    function deleteBehaviours(fnCallback) {
        if (!skillDeleted) {
            async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
                //Delete Behaviour
                if (aBehaviour.indexOf('deletebehaviourid') > -1) {
                    var behaviourToDelete = aBehaviour;
                    var behaviourID = String(behaviourToDelete.match(/[0-9]+/g));
                    connection.get().query('DELETE behaviours FROM behaviours INNER JOIN skills ON skills.skill_id = behaviours.skill_id WHERE behaviours.behaviour_id = ?', [behaviourID], function (err, skillResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = 'Our database servers maybe down. Please try again.';
                            //Render the page wth error messages
                            return res.render('behaviours/add-behaviour', returnObj);
                        }
                        else {
                            behaviourDeleted = true;
                            callback(null);
                        }
                    });
                }
                else
                {
                    callback(null);
                }
            }, fnCallback);
        }
        else
        {
            fnCallback(null);
        }
    }
    //If we aren't deleting any skills or behaviours, we must be updating a skill
    function updateSkill(fnCallback) {
        if (!behaviourDeleted) {
            async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
                if (skillTitle != null || skillTitle != "") {
                    //Update the skill name
                    connection.get().query('UPDATE skills SET skill_title = ? WHERE skill_id = ?', [skillTitle, req.params.skill], function (err, skillResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = 'Our database servers maybe down. Please try again.';
                            //Render the page wth error messages
                            return res.render('behaviours/add-behaviour', returnObj);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
                else {
                    returnObj['message'] = 'One of the skills was empty, please enter a skill name';
                    //Render the page wth error messages
                    return res.render('behaviours/add-behaviour', returnObj);
                }
            }, fnCallback);
        }
        else
        {
            fnCallback(null);
        }
    }
    //If we aren't deleting any skills or behaviours, we must be updating a behaviour
    function updateBehaviour(fnCallback)
    {
        async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
            if(!skillDeleted && !behaviourDeleted) {
                //Update the behaviour description
                if (aBehaviour.indexOf('behaviourid') > -1) {
                    if (behaviours[aBehaviour] == null || behaviours[aBehaviour] == "") {
                        returnObj['message'] = 'One of the behaviours was empty, please enter a behaviour description';
                        //Render the page wth error messages
                        return res.render('behaviours/add-behaviour', returnObj);
                    }
                    behaviourAdded = true;
                    behaviourDesc = behaviours[aBehaviour];
                    //Regex to extract numbers from textarea id
                    num = String(aBehaviour.match(/[0-9]+/g));
                    connection.get().query('SELECT behaviour_id FROM behaviours WHERE behaviour_id = ?', num, function (err, behaviourResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = 'Our database servers maybe down. Please try again.';
                            //Render the page wth error messages
                            return res.render('behaviours/add-behaviour', returnObj);
                        }
                        //Add Behaviour
                        else if (behaviourResults.length <= 0) {
                            //Creating the JSON array to store the behaviour data
                            var behaviour = {
                                skill_id: req.params.skill,
                                behaviour_desc: behaviourDesc
                            }; //End behaviour
                            connection.get().query('INSERT INTO behaviours SET ?', [behaviour], function (err, skillResults) {
                                //If an error is thrown
                                if (err) {
                                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                    //Render the page wth error messages
                                    return res.render('behaviours/add-behaviour', returnObj);
                                }
                                else {
                                }
                            });
                        }
                        else
                        {
                            //Update Behaviour
                            connection.get().query('UPDATE behaviours SET behaviour_desc = ? WHERE behaviour_id = ?', [behaviourDesc, num], function (err, skillResults) {
                                //If an error is thrown
                                if (err) {
                                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                    //Render the page wth error messages
                                    return res.render('behaviours/add-behaviour', returnObj);
                                }
                                else {
                                }
                            });
                        }
                    });
                }
            }
            callback(null);
        },fnCallback);
    }
    //Finally redirect the user back to the behaviours page
    function redirectUser(fnCallback)
    {
        //If all is good, return them to the behaviours page
        if (behaviourDeleted && !skillDeleted) {
            req.flash('success_messages', 'The behaviour was successfully deleted from the database.');
            req.session.success = true;
            returnObj['message'] = undefined;
            //callback(null);
            return res.redirect('/users/behaviours');
        }
        else {
            req.flash('success_messages', 'The skill ' + skillTitle + ' and behaviour(s) have been edited successfully.');
            req.session.success = true;
            returnObj['message'] = undefined;
            return res.redirect('/users/behaviours');
        }
    }
});
// When the user has added a behaviour, update the database and return them to the behaviours page
router.post('/add-behaviour', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    var behaviours = req.body;
    var skillTitle = req.body.skillid1;
    var skillID = '';
    var behaviourDesc = '';
    var num = "";
    var skillsDone = false;
    var behavioursDone = false;
    returnObj['title'] ='Add Skills/Behaviours';
    //Filter post data
    async.eachSeries(Object.keys(behaviours), function (aSkill, callback) {
        if (aSkill.indexOf('skillid') == -1 && aSkill.indexOf('behaviourid') == -1) {
            delete behaviours[aSkill];
        }
    }
    );
    //If a behaviour is blank stop, and show them an error message
    for(var aBehaviour in behaviours)
    {
        if (aBehaviour.indexOf('behaviourid') > -1) {
            if (behaviours[aBehaviour] == null || behaviours[aBehaviour] == "") {
                returnObj['message'] = 'One of the behaviours was empty, please enter a behaviour name';
                //Render the page wth error messages
                return res.render('behaviours/add-behaviour', returnObj);
            }
        }
    }

    async.series([
        insertSkill,
        insertBehaviours,
        redirectUser
    ], function(err, results){
            console.log(results);
        });


    function insertSkill(fnCallback){
        //Get the skill title and behaviours, then perform CRUD if necessary
        async.eachSeries(Object.keys(behaviours), function (aSkill, callback){
            if (aSkill.indexOf('skillid') > -1) {
                if (behaviours[aSkill] == null || behaviours[aSkill] == "") {
                    returnObj['message'] = 'One of the skills was empty, please enter a skill name';

                    //Render the page wth error messages
                    return res.render('behaviours/add-behaviour', returnObj);
                }

                //Regex to extract numbers from textarea id
                skillTitle = behaviours[aSkill];
                num = String(skillTitle.match(/[0-9]+/g));
                connection.get().query('SELECT skill_id FROM skills WHERE skill_id = ?', num, function (err, skillResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('behaviours/add-behaviour', returnObj);
                    }
                    //Add Behaviour
                    if (skillTitle != null || skillTitle != "") {
                        //Creating the JSON array to store the behaviour data
                        var skill = {
                            skill_title: skillTitle
                        }; //End behaviour
                        connection.get().query('INSERT INTO skills SET ?', [skill], function (err, skillResults) {
                            //If an error is thrown
                            if (err) {
                                returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                //Render the page wth error messages
                                return res.render('behaviours/add-behaviour', returnObj);
                            }
                            else {
                                callback(null);
                                skillID = skillResults.insertId;
                                fnCallback(null);
                            }
                        });
                    }
                    else
                    {
                        returnObj['message'] = 'One of the skills was empty, please enter a skill name';
                        //Render the page wth error messages
                        return res.render('behaviours/add-behaviour', returnObj);
                    }
                });
            }
        },fnCallback);
    }
    function insertBehaviours(fnCallback){
        async.eachSeries(Object.keys(behaviours), function (aBehaviour, secondCallback) {
            if (aBehaviour.indexOf('behaviourid') > -1) {
                if (behaviours[aBehaviour] == null || behaviours[aBehaviour] == "") {
                    returnObj['message'] = 'One of the behaviours was empty, please enter a behaviour name';
                    //Render the page wth error messages
                    return res.render('behaviours/add-behaviour', returnObj);
                }
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
                            return res.render('behaviours/add-behaviour', returnObj);
                        }
                    });
                }
            }
            secondCallback(null);
        },fnCallback);
    }
    function redirectUser(fnCallBack)
    {
        //Update the behaviour description
        //If all is good, return them to the behaviours page
        req.flash('success_messages', 'The behaviour was successfully added to the database.');
        req.session.success = true;
        returnObj['message'] = undefined;
        return res.redirect('/users/behaviours');
    }
});

// When the user has edited a behaviour, update the database and return them to the behaviours page
router.post('/add-behaviour/:skill', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }
    //Store variables from the submitted form
    var behaviours = req.body;
    var skillTitle = req.body.skillTitleBox;
    var behaviourDesc = '';
    var num = '';
    returnObj['title'] ='Edit Skills/Behaviours';
    var behaviourAdded = false;
    var behaviourDeleted = false;
    var skillDeleted = false;
    //Execute these functions in series, that is 1 after the other
    async.series([
        filterPostData,
        deleteSkills,
        deleteBehaviours,
        updateSkill,
        updateBehaviour,
        redirectUser
    ], function(err, results){
    });
    //Filter submitted data
    function filterPostData(fnCallback) {
        async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
            if (aBehaviour.indexOf('skillid') == -1 && aBehaviour.indexOf('behaviourid') == -1 && aBehaviour.indexOf('deletebehaviourid') == -1 && aBehaviour.indexOf('deleteskillid') == -1) {
                delete behaviours[aBehaviour];
            }
            callback(null);
        }, fnCallback);
    }
    //Check to see if we are deleting any skills
    function deleteSkills(fnCallback) {
        async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
            //Delete Skill
            if (aBehaviour.indexOf('deleteskillid') > -1) {
                var skillToDelete = aBehaviour;
                var skillID = String(skillToDelete.match(/[0-9]+/g));
                connection.get().query('DELETE FROM skills WHERE skill_id = ?', [skillID], function (err, skillResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = 'Our database servers maybe down. Please try again.';
                        //Render the page wth error messages
                        return res.render('behaviours/add-behaviour', returnObj);
                    }
                    else {
                        behaviourDeleted = true;
                        skillDeleted = true;
                        fnCallback(null);
                    }
                });
            }
            else
            {
                callback(null);
            }
        }, fnCallback);
    }
    //Check to see if we are deleting any behaviours
    function deleteBehaviours(fnCallback)
    {
        if (!skillDeleted) {
            async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
                //Delete Behaviour
                if (aBehaviour.indexOf('deletebehaviourid') > -1) {
                    var behaviourToDelete = aBehaviour;
                    var behaviourID = String(behaviourToDelete.match(/[0-9]+/g));
                    connection.get().query('DELETE behaviours FROM behaviours INNER JOIN skills ON skills.skill_id = behaviours.skill_id WHERE behaviours.behaviour_id = ?', [behaviourID], function (err, skillResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = 'Our database servers maybe down. Please try again.';
                            //Render the page wth error messages
                            return res.render('behaviours/add-behaviour', returnObj);
                        }
                        else {
                            behaviourDeleted = true;
                            callback(null);
                        }
                    });
                }
                else
                {
                    callback(null);
                }
            }, fnCallback);
        }
        else
        {
            fnCallback(null);
        }
    }
    //If we aren't deleting any skills or behaviours, we must be updating a skill
    function updateSkill(fnCallback) {
        if (!behaviourDeleted) {
            async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
                if (skillTitle != null || skillTitle != "") {
                    //Update the skill name
                    connection.get().query('UPDATE skills SET skill_title = ? WHERE skill_id = ?', [skillTitle, req.params.skill], function (err, skillResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = 'Our database servers maybe down. Please try again.';
                            //Render the page wth error messages
                            return res.render('behaviours/add-behaviour', returnObj);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
                else {
                    returnObj['message'] = 'One of the skills was empty, please enter a skill name';
                    //Render the page wth error messages
                    return res.render('behaviours/add-behaviour', returnObj);
                }
            }, fnCallback);
        }
        else
        {
            fnCallback(null);
        }
    }
    //If we aren't deleting any skills or behaviours, we must be updating a behaviour
    function updateBehaviour(fnCallback)
    {
        async.eachSeries(Object.keys(behaviours), function (aBehaviour, callback) {
            if(!skillDeleted && !behaviourDeleted) {
                //Update the behaviour description
                if (aBehaviour.indexOf('behaviourid') > -1) {
                    if (behaviours[aBehaviour] == null || behaviours[aBehaviour] == "") {
                        returnObj['message'] = 'One of the behaviours was empty, please enter a behaviour description';
                        //Render the page wth error messages
                        return res.render('behaviours/add-behaviour', returnObj);
                    }
                    behaviourAdded = true;
                    behaviourDesc = behaviours[aBehaviour];
                    //Regex to extract numbers from textarea id
                    num = String(aBehaviour.match(/[0-9]+/g));
                    connection.get().query('SELECT behaviour_id FROM behaviours WHERE behaviour_id = ?', num, function (err, behaviourResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = 'Our database servers maybe down. Please try again.';
                            //Render the page wth error messages
                            return res.render('behaviours/add-behaviour', returnObj);
                        }
                        //Add Behaviour
                        else if (behaviourResults.length <= 0) {
                            //Creating the JSON array to store the behaviour data
                            var behaviour = {
                                skill_id: req.params.skill,
                                behaviour_desc: behaviourDesc
                            }; //End behaviour
                            connection.get().query('INSERT INTO behaviours SET ?', [behaviour], function (err, skillResults) {
                                //If an error is thrown
                                if (err) {
                                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                    //Render the page wth error messages
                                    return res.render('behaviours/add-behaviour', returnObj);
                                }
                                else {
                                }
                            });
                        }
                        else
                        {
                            //Update Behaviour
                            connection.get().query('UPDATE behaviours SET behaviour_desc = ? WHERE behaviour_id = ?', [behaviourDesc, num], function (err, skillResults) {
                                //If an error is thrown
                                if (err) {
                                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                                    //Render the page wth error messages
                                    return res.render('behaviours/add-behaviour', returnObj);
                                }
                                else {
                                }
                            });
                        }
                    });
                }
            }
            callback(null);
        },fnCallback);
    }
    //Finally redirect the user back to the behaviours page
    function redirectUser(fnCallback)
    {
        //If all is good, return them to the behaviours page
        if (behaviourDeleted && !skillDeleted) {
            req.flash('success_messages', 'The behaviour was successfully deleted from the database.');
            req.session.success = true;
            returnObj['message'] = undefined;
            //callback(null);
            return res.redirect('/users/behaviours');
        }
        else {
            req.flash('success_messages', 'The skill ' + skillTitle + ' and behaviour(s) have been edited successfully.');
            req.session.success = true;
            returnObj['message'] = undefined;
            return res.redirect('/users/behaviours');
        }
    }
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = router;