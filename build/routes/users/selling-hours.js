'use strict';

var _utility = require('../../utility');

var utility = _interopRequireWildcard(_utility);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

            returnObj['users'] = [];
            result.forEach(function (user) {
                delete user['password'];
                returnObj['users'].push(user);
            });

            returnObj['usersObj'] = JSON.stringify(returnObj['users']);
            returnObj['selectedEmployee'] = req.user.t_number;
            sellingHoursModel.getAllHours(req.session.store_id, function (err, result) {
                if (err) {
                    throw next(err);
                } //end if)
                returnObj['hours'] = result;
                returnObj['hoursObj'] = JSON.stringify(result);
                if (req.session.success) {
                    req.flash('success_messages', 'success');
                    req.session.success = false;
                } //end if

                sellingHoursModel.getBudgets(endOfWeek, function (err, budgetResults) {
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
            return res.redirect('/users/selling-hours');
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
//Delete weekly hours
router.post('/delete-hours', ensureAuthenticated, function (req, res, next) {
    var aDate = moment(req.body.hiddenDate).format("YYYY-MM-DD");
    console.log(aDate);
    sellingHoursModel.deleteCurrentWeekHours(aDate, function (err, result) {
        if (err) {
            return res.end('Error: ' + err.message);
        }
        return res.redirect('/users/selling-hours');
    });
});

//Filter by week
router.post('/update-week', ensureAuthenticated, function (req, res, next) {
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
        return res.render('selling-hours/selling-hours', returnObj);
    });
});

router.post('/budgets', ensureAuthenticated, function (req, res, next) {
    var data = req.body.name;
    data = data.split(',');

    utility.log({ type: 'log', message: data + 'store id from field' });

    sellingHoursModel.getBudgetsWithStore([endOfWeek, data[2]], function (err, result) {
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