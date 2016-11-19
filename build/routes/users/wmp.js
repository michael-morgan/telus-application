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

var moment = require('../../bower_components/bootstrap-daterangepicker/moment.min.js');
var endOfWeek = moment().startOf('isoWeek').add(5, 'day').format('YYYY-MM-DD');
var currentDate = moment().format("yyyy-MM-DD");

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

                //Bradley wrote this
                sellingHoursModel.getBudgetsWithStore([endOfWeek, req.session.store_id], function (err, result) {
                    if (err) {
                        throw next(err);
                    } //end if

                    var budgetsResult = result;

                    returnObj['budgets'] = budgetsResult;
                    returnObj['budgetsObj'] = JSON.stringify(budgetsResult);

                    res.render('wmp', returnObj);
                });
            });
        });
    });
});

router.post('/', ensureAuthenticated, function (req, res, next) {
    if (req.body.dateRange != undefined && req.body.dateRange != '') {
        var selectedDate = req.body.dateRange;
        sellingHoursModel.getHoursByDate(req.session.store_id, selectedDate, function (err, result) {
            if (err) {
                throw next(err);
            } //end if)
            returnObj['hours'] = result;
            returnObj['hoursObj'] = JSON.stringify(result);
            returnObj['selectedDate'] = selectedDate;
            console.log(returnObj['selectedDate']);
            if (req.session.success) {
                req.flash('success_messages', 'success');
                req.session.success = false;
            } //end if
            return res.redirect('/users/wmp');
        });
    } else {
        var data = req.body.name;
        data = data.split(',');
        for (var aData in data) {
            console.log(aData);
        }
        //Update selling hours
        sellingHoursModel.updateHoursByID([req.body.value, data[0], data[1], data[2]], function (err, result) {
            if (err) {
                return res.end('Error: ' + err.message);
            }

            //No rows affected, guess we have to insert
            if (result == 0) {
                utility.log({ type: 'log', message: "Selling Hours: " + req.body.value });
                utility.log({ type: 'log', message: "team_member: " + data[0] });
                utility.log({ type: 'log', message: "store_id: " + data[1] });
                utility.log({ type: 'log', message: "date: " + data[2] });

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
    }
});

//When a date is selected in the date picker, it reloads the page
//Since there is only dummy data on the WMP page, this code doesn't actually update anything
router.post('/ss', ensureAuthenticated, function (req, res, next) {
    var selectedDate = req.body.dateRange;
    returnObj['selectedDate'] = selectedDate;
    console.log(returnObj['selectedDate']);
    if (req.session.success) {
        req.flash('success_messages', 'success');
        req.session.success = false;
    } //end if
    res.redirect('/users/wmp');
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