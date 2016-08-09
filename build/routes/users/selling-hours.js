'use strict';

/**
 * Created by Jacob on 2016-05-29.
 */
var express = require('express');
var connection = require('../../connection');
var passport = require('passport');

var userModel = require('../../models/user');
var storeModel = require('../../models/store');
var sellingHoursModel = require('../../models/selling-hours');
var returnObj = {};
var router = express.Router();

// Get for behaviours and show them for each skill
router.get('/', ensureAuthenticated, function (req, res, next) {
    returnObj['message'] = undefined;
    var storeIds = [];
    //Ensure user is logged in
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    if (!req.body) {
        return res.sendStatus(400);
    }

    returnObj['title'] = 'Selling Hours';
    storeModel.getStoresByTNumber(req.user.t_number, function (err, result) {
        if (err) {
            throw next(err);
        } //end if

        returnObj['stores'] = result;
        returnObj['storesObj'] = JSON.stringify(returnObj['stores']);
        for (var storeIndex in returnObj['stores']) {
            if (!returnObj['stores'].hasOwnProperty(storeIndex)) {
                continue;
            }
            storeIds.push(returnObj['stores'][storeIndex].store_id);
        }

        userModel.getAllUsersByStoreIds(storeIds, function (err, result) {
            if (err) {
                throw next(err);
            } //end if
            returnObj['users'] = result;
            returnObj['usersObj'] = JSON.stringify(result);
            returnObj['selectedEmployee'] = req.user.t_number;
            //Display success message on adding a transaction
            sellingHoursModel.getHoursByStoreIDForCurrentWeek(req.session.store_id, function (err, result) {
                if (err) {
                    throw next(err);
                } //end if)
                returnObj['hours'] = result;
                returnObj['hoursObj'] = JSON.stringify(result);
                if (req.session.success) {
                    req.flash('success_messages', 'Transaction successfully added!');
                    //res.locals.success_messages = req.flash('success_messages');
                    req.session.success = false;
                } //end if

                return res.render('selling-hours/selling-hours', returnObj);
            });
        });
    });
});

router.post('/', ensureAuthenticated, function (req, res, next) {
    var data = req.body.name;
    data = data.split(',');
    //Update selling hours
    sellingHoursModel.updateHoursByID([req.body.value, data[0], data[1], data[2]], function (err, result) {
        if (err) {
            return res.end('Error: ' + err.message);
        }
        //No rows affected, guess we have to insert
        if (result == 0) {
            console.log("Selling Hours: " + req.body.value);
            console.log("team_member: " + data[0]);
            console.log("store_id: " + data[1]);
            console.log("date: " + data[2]);

            var hours = {
                selling_hours: req.body.value,
                team_member: data[0],
                store_id: data[1],
                date: data[2]
            };
            sellingHoursModel.create(hours, function (err, result) {
                if (err) {
                    return res.end('Error: ' + err.message);
                }
                res.send(JSON.stringify(req.body));
            });
        } else res.send(JSON.stringify(req.body));
    });
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;

//# sourceMappingURL=selling-hours.js.map