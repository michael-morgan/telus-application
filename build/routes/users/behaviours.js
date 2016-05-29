var express = require('express');
var connection = require('../../connection');
var passport = require('passport');

var router = express.Router();

// Get for observations when the page is loaded, show the observations for each user
router.get('/', ensureAuthenticated, function (req, res, next) {
    if (!req.body) { return res.sendStatus(400); }

    var returnObj = {
        title: 'Behaviours',
        behaviours: [{
            id:1,
            name:'Skill #1'
        },{
            id:2,
            name:'Skill #2'
        },{
            id:3,
            name:'Skill #3'
        },{
            id:4,
            name:'Skill #4'
        },{
            id:5,
            name:'Add New Skill'
        },]
    };

    return res.render('behaviours', returnObj);
});

router.get('/add-behaviour', ensureAuthenticated, function (req, res, next) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var returnObj = {
        title: 'Add Behaviour'
    };

    return res.render('add-behaviour', returnObj);
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = router;