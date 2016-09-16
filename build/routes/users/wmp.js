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

router.get('/', ensureAuthenticated, function (req, res, next) {
    //Ensure user is logged in
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    returnObj['title'] = 'WMP';
    returnObj['message'] = undefined;

    storeModel.getStoresByTNumber(req.user.t_number, function (err, result) {
        if (err) {
            throw next(err);
        } //end if

        var storesResult = result;

        returnObj['stores'] = storesResult;
        returnObj['currentStore'] = storesResult.find(function (store) {
            return store.store_id == req.session.store_id;
        });
        returnObj['storesObj'] = JSON.stringify(returnObj['stores']);

        var storeIds = [];
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

            returnObj['users'] = [];
            result.forEach(function (user) {
                delete user['password'];
                returnObj['users'].push(user);
            });

            returnObj['usersObj'] = JSON.stringify(returnObj['users']);
            returnObj['selectedEmployee'] = req.user.t_number;

            sellingHoursModel.getHoursByStoreId(req.session.store_id, function (err, result) {
                if (err) {
                    throw next(err);
                } //end if

                var hoursResult = result;

                returnObj['hours'] = hoursResult;
                returnObj['hoursObj'] = JSON.stringify(hoursResult);

                var storeTotalHours = 0;
                returnObj['users'].forEach(function (user, userIndex, userArray) {
                    if (user.privileged == 5) {
                        return;
                    }

                    userArray[userIndex]['hours'] = hoursResult.filter(function (row) {
                        return row.team_member == user.t_number;
                    });

                    var total = 0;
                    for (var hourIndex in userArray[userIndex]['hours']) {
                        total += userArray[userIndex]['hours'][hourIndex].selling_hours;
                    }

                    userArray[userIndex]['totalHours'] = total;
                    storeTotalHours += total;
                });

                returnObj['stores'][returnObj['stores'].findIndex(function (store) {
                    return store.store_id == req.session.store_id;
                })]['totalHours'] = storeTotalHours;
                returnObj['currentStore']['totalHours'] = storeTotalHours;

                returnObj['users'].forEach(function (user, userIndex, userArray) {
                    userArray[userIndex]['hoursPercent'] = userArray[userIndex]['totalHours'] / storeTotalHours * 100;
                });

                res.render('wmp', returnObj);
            });
        });
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

//# sourceMappingURL=wmp.js.map