'use strict';

/**
 * Created by Jacob on 2016-05-29.
 */
var express = require('express');
var connection = require('../../connection');
var passport = require('passport');

var moment = require('../../bower_components/bootstrap-daterangepicker/moment.min.js');

var userModel = require('../../models/user');
var storeModel = require('../../models/store');
var sellingHoursModel = require('../../models/selling-hours');
var returnObj = {};
var router = express.Router();

var endOfWeek = moment().startOf('isoWeek').add(5, 'day').format('YYYY-MM-DD');

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
            sellingHoursModel.getHoursByStoreIDForCurrentWeek(req.session.store_id, function (err, result) {
                if (err) {
                    throw next(err);
                } //end if)
                returnObj['hours'] = result;
                returnObj['hoursObj'] = JSON.stringify(result);
                if (req.session.success) {
                    req.flash('success_messages', 'success');
                    req.session.success = false;
                } //end if

                sellingHoursModel.getBudgets([endOfWeek, req.session.store_id], function (err, budgetResults) {
                    if (err) {
                        throw next(err);
                    } //end if
                    returnObj['budgets'] = budgetResults;

                    returnObj['budgetsObj'] = JSON.stringify(returnObj['budgets']);

                    return res.render('selling-hours/selling-hours', returnObj);
                });
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
            console.log("date: " + saturday);

            var hours = {
                selling_hours: req.body.value,
                team_member: data[0],
                store_id: data[1],
                date: endOfWeek
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

router.post('/budgets', ensureAuthenticated, function (req, res, next) {
    var data = req.body.name;
    data = data.split(',');

    sellingHoursModel.getBudgets([endOfWeek, data[2]], function (err, result) {
        if (err) {
            return res.end('Error: ' + err.message);
        }

        var budget = {
            CTs: undefined,
            revenue: undefined,
            aotm: undefined,
            ls: undefined,
            date: endOfWeek,
            store_id: data[2]
        };

        //Update
        if (result != 0) {
            budget['CTs'] = result[0].CTs;
            budget['revenue'] = result[0].revenue;
            budget['aotm'] = result[0].aotm;
            budget['ls'] = result[0].ls;
        }

        var budgetType = data[0];
        switch (budgetType) {
            case 'CTs':
                budget['CTs'] = req.body.value;
                break;
            case 'revenue':
                budget['revenue'] = req.body.value;
                break;
            case 'aotm':
                budget['aotm'] = req.body.value;
                break;
            case 'ls':
                budget['ls'] = req.body.value;
                break;
        }

        console.log(budget);

        if (result == 0) {
            sellingHoursModel.createBudgets(budget, function (err, result) {
                if (err) {
                    return res.end('Error creating: ' + err.message);
                }
                res.send(JSON.stringify(req.body));
            });
        } else {
            sellingHoursModel.updateBudgets([budget['CTs'], budget['revenue'], budget['aotm'], budget['ls'], budget['date'], budget['store_id']], function (err, result) {
                if (err) {
                    return res.end('Error updating: ' + err.message);
                }

                res.send(JSON.stringify(req.body));
            });
        }
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