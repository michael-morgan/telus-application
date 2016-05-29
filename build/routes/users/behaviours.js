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
    if(req.session.success)
    {
        req.flash('success_messages', 'Behaviour successfully added!');
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

        returnObj['skills'] = skillResults;
        //Render the observations page with the list of users and observations
        return res.render('add-behaviour', returnObj);
    });
});

// When the add-observation page is loaded, and there is a t_number is the url. Render the add observations page
router.get('/add-behaviour/:behaviour', ensureAuthenticated, function (req, res, next) {
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
        else {
            connection.get().query('SELECT skills.skill_id,skills.skill_title,behaviour_desc FROM skills INNER JOIN behaviours ON skills.skill_id = behaviours.skill_id ' +
                'WHERE behaviours.behaviour_id = ?', req.params.behaviour, function (err, behaviourResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = 'Our database servers maybe down. Please try again.';
                    //Render the page wth error messages
                    return res.render('add-behaviour', returnObj);
                }
                else {
                    returnObj['skills'] = skillResults;
                    returnObj['selectedbehaviour'] = req.params.behaviour;
                    returnObj['selectedskill'] = behaviourResults;
                    //Render the observations page with the list of users and observations
                    return res.render('add-behaviour', returnObj);
                }
            });
        }
    });
});
// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}
module.exports = router;