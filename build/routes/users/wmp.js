'use strict';

var _express = require('express');

var express = _interopRequireWildcard(_express);

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _async = require('async');

var async = _interopRequireWildcard(_async);

var _user = require('../../models/user');

var userModel = _interopRequireWildcard(_user);

var _store = require('../../models/store');

var storeModel = _interopRequireWildcard(_store);

var _transactions = require('../../models/transactions');

var transactionModel = _interopRequireWildcard(_transactions);

var _sellingHours = require('../../models/selling-hours');

var sellingHoursModel = _interopRequireWildcard(_sellingHours);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//let endOfWeek = moment().startOf('isoWeek').add(5,'day').format('YYYY-MM-DD');
//let currentDate = moment().format("yyyy-MM-DD");

// model imports

//import * as moment from '../../bower_components/bootstrap-daterangepicker/moment.min.js';
var router = express.Router();

router.get('/', ensureAuthenticated, function (req, res, next) {
	if (req.user.privileged <= 2) {
		return res.redirect('/users/');
	}

	// locals
	var returnObj = { title: 'WMP', message: undefined };
	var storeIds = [];

	var setStores = function setStores(callback) {
		storeModel.getStoresByTNumber(req.user.t_number, function (err, result) {
			if (err) {
				throw next(err);
			}

			returnObj['stores'] = result;
			returnObj['currentStore'] = _.find(result, function (store) {
				return store.store_id == req.session.store_id;
			});

			async.each(result, function (item, cb) {
				storeIds.push(item.store_id);
				cb();
			}, function (itemError) {
				if (itemError) {
					throw next(itemError);
				}
			});

			callback(null);
		});
	};

	var setUsers = function setUsers(callback) {
		userModel.getAllUsersByStoreIds(storeIds, function (err, result) {
			if (err) {
				throw next(err);
			}

			returnObj['users'] = [];

			async.each(result, function (item, cb) {
				delete item['password'];
				returnObj['users'].push(item);
				cb();
			}, function (itemError) {
				if (itemError) {
					throw next(itemError);
				}
			});

			returnObj['selectedEmployee'] = req.user.t_number;

			callback(null);
		});
	};

	var setUserTransactions = function setUserTransactions(callback) {
		transactionModel.getUserTransactions(function (err, result) {
			if (err) {
				throw next(err);
			}

			async.each(returnObj['users'], function (item, cb) {
				var userTransaction = _.find(result, function (userTransactions) {
					return userTransactions.t_number === item.t_number;
				});

				item['transactions'] = userTransaction ? userTransaction.count : 0;
				cb();
			}, function (itemError) {
				if (itemError) {
					throw next(itemError);
				}
			});

			callback(null);
		});
	};

	var setHours = function setHours(callback) {
		sellingHoursModel.getHoursByStoreId(req.session.store_id, function (err, result) {
			if (err) {
				throw next(err);
			}

			returnObj['hours'] = result;

			var storeTotalHours = 0;

			async.each(returnObj['users'], function (item, cb) {

				item['hours'] = _.filter(result, function (row) {
					return row.team_member == item.t_number;
				});

				var total = 0;
				for (var hourIndex in item['hours']) {
					total += item['hours'][hourIndex].selling_hours;
				}

				item['totalHours'] = total;
				storeTotalHours += total;

				cb();
			}, function (itemError) {
				if (itemError) {
					throw next(itemError);
				}
			});

			returnObj['stores'][_.findIndex(returnObj['stores'], function (store) {
				return store.store_id === req.session.store_id;
			})]['totalHours'] = storeTotalHours;

			returnObj['currentStore']['totalHours'] = storeTotalHours;

			async.each(returnObj['users'], function (item, cb) {
				item['hoursPercent'] = item['totalHours'] / storeTotalHours * 100;
				cb();
			}, function (itemError) {
				if (itemError) {
					throw next(itemError);
				}
			});

			callback(null);
		});
	};

	var setBudgets = function setBudgets(callback) {
		sellingHoursModel.getAllBudgets(function (err, result) {
			if (err) {
				throw next(err);
			}

			returnObj['budgets'] = result;

			callback(null);
		});
	};

	// async series
	async.series([setStores, setUsers, setUserTransactions, setHours, setBudgets], function (err, results) {

		returnObj['storesObj'] = JSON.stringify(returnObj['stores']);
		returnObj['usersObj'] = JSON.stringify(returnObj['users']);
		returnObj['hoursObj'] = JSON.stringify(returnObj['hours']);
		returnObj['budgetsObj'] = JSON.stringify(returnObj['budgets']);

		res.render('wmp', returnObj);
	});
});

/*
router.post('/', ensureAuthenticated, (req, res, next) => {
    if(req.body.dateRange != undefined && req.body.dateRange != '') {
        var selectedDate = req.body.dateRange;
        sellingHoursModel.getHoursByDate(req.session.store_id, selectedDate, (err, result) => {
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
            }  //end if
            return res.redirect('/users/wmp');
        });
    }
    else {
        var data = req.body.name;
        data = data.split(',');
        for (var aData in data) {
            console.log(aData);
        }
        //Update selling hours
        sellingHoursModel.updateHoursByID([req.body.value, data[0], data[1], data[2]], (err, result) => {
            if (err) {
                return res.end('Error: ' + err.message);
            }

            //No rows affected, guess we have to insert
            if (result == 0) {
                utility.log({type: 'log', message: "Selling Hours: " + req.body.value});
                utility.log({type: 'log', message: "team_member: " + data[0]});
                utility.log({type: 'log', message: "store_id: " + data[1]});
                utility.log({type: 'log', message: "date: " + data[2]});

                var hours = {
                    selling_hours: req.body.value,
                    team_member: data[0],
                    store_id: data[1],
                    date: data[2]
                };
                sellingHoursModel.create(hours, (err, result) => {
                    if (err) {
                        return res.end('Error: ' + err.message);
                    }
                    res.send(JSON.stringify(req.body));
                });
            }
            else
                res.send(JSON.stringify(req.body));
        });
    }
});

//When a date is selected in the date picker, it reloads the page
//Since there is only dummy data on the WMP page, this code doesn't actually update anything
router.post('/ss', ensureAuthenticated, (req, res, next) => {
    var selectedDate = req.body.dateRange;
    returnObj['selectedDate'] = selectedDate;
    console.log(returnObj['selectedDate']);
    if (req.session.success) {
        req.flash('success_messages', 'success');
        req.session.success = false;
    }  //end if
    res.redirect('/users/wmp');
});*/

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

module.exports = router;

//# sourceMappingURL=wmp.js.map