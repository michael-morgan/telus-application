/**
 * Created by Jacob on 2016-05-29.
 */
var express = require('express');
var connection = require('../../connection');
var passport = require('passport');

var userModel = require('../../models/user');
var storeModel = require('../../models/store');
var returnObj = {};
var router = express.Router();

// Get for behaviours and show them for each skill
router.get('/', ensureAuthenticated, function (req, res, next) {
    returnObj['message'] = undefined;
    let storeIds = [];
    //Ensure user is logged in
    if (req.user.privileged <= 2) { return res.redirect('/users/'); }

    if (!req.body) { return res.sendStatus(400); }

    returnObj['title'] = 'Selling Hours';
    storeModel.getStoresByTNumber(req.user.t_number, (err, result) => {
        if (err) {
            throw next(err);
        } //end if

        returnObj['stores'] = result;
        returnObj['storesObj'] = JSON.stringify(returnObj['stores']);
        for(let storeIndex in returnObj['stores']) {
            if(!returnObj['stores'].hasOwnProperty(storeIndex)) { continue; }
            storeIds.push(returnObj['stores'][storeIndex].store_id);
        }

        userModel.getAllUsersByStoreIds(storeIds, (err, result) => {
            if (err) {
                throw next(err);
            } //end if

            returnObj['users'] = result;
            returnObj['usersObj'] = JSON.stringify(result);
            returnObj['selectedEmployee'] = req.user.t_number;
            //Display success message on adding a transaction
            if (req.session.success) {
                req.flash('success_messages', 'Transaction successfully added!');
                //res.locals.success_messages = req.flash('success_messages');
                req.session.success = false;
            }  //end if
            return res.render('selling-hours/selling-hours', returnObj);
        });
    });
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = router;