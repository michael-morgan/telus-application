import * as express from 'express';
//import * as moment from '../../bower_components/bootstrap-daterangepicker/moment.min.js';
import * as _ from 'lodash';
import * as async from 'async';

// model imports
import * as userModel from '../../models/user';
import * as storeModel from '../../models/store';
import * as transactionModel from '../../models/transactions';
import * as sellingHoursModel from '../../models/selling-hours';


//let endOfWeek = moment().startOf('isoWeek').add(5,'day').format('YYYY-MM-DD');
//let currentDate = moment().format("yyyy-MM-DD");

let router = express.Router();

router.get('/', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) { return res.redirect('/users/'); }

	// locals
	let returnObj = { title: 'WMP', message: undefined };
	let storeIds = [];

    let setStores = (callback) => {
		storeModel.getStoresByTNumber(req.user.t_number, (err, result) => {
			if(err) {
				throw next(err);
			}

			returnObj['stores'] = result;
			returnObj['currentStore'] = _.find(result, (store) => store.store_id == req.session.store_id);

			async.each(result, (item, cb) => {
				storeIds.push(item.store_id);
				cb();
			}, (itemError) => {
				if(itemError) {
					throw next(itemError);
				}
			});

			callback(null);
		});
	};

    let setUsers = (callback) => {
		userModel.getAllUsersByStoreIds(storeIds, (err, result) => {
			if(err) {
				throw next(err);
			}

			returnObj['users'] = [];

			async.each(result, (item, cb) => {
				delete item['password'];
				returnObj['users'].push(item);
				cb();
			}, (itemError) => {
				if(itemError) {
					throw next(itemError);
				}
			});
			
			returnObj['selectedEmployee'] = req.user.t_number;

			callback(null);
		});
	};

    let setUserTransactions = (callback) => {
		transactionModel.getUserTransactions((err, result) => {
			if(err) {
				throw next(err);
			}

			async.each(returnObj['users'], (item, cb) => {
				let userTransaction = _.find(
					result,
					userTransactions => userTransactions.t_number === item.t_number
				);

				item['transactions'] =
					userTransaction
						? userTransaction.count
						: 0;
				cb();
			}, (itemError) => {
				if(itemError) {
					throw next(itemError);
				}
			});

			callback(null);
		});
	};
	
    let setHours = (callback) => {
		sellingHoursModel.getHoursByStoreId(req.session.store_id, (err, result) => {
			if(err) {
				throw next(err);
			}

			returnObj['hours'] = result;

			let storeTotalHours = 0;

			async.each(returnObj['users'], (item, cb) => {

				item['hours'] = _.filter(result, row => row.team_member == item.t_number);

				let total = 0;
				for (let hourIndex in item['hours']) {
					total += item['hours'][hourIndex].selling_hours;
				}

				item['totalHours'] = total;
				storeTotalHours += total;

				cb();
			}, (itemError) => {
				if(itemError) {
					throw next(itemError);
				}
			});

			returnObj['stores'][
				_.findIndex(
					returnObj['stores'],
					store => store.store_id === req.session.store_id
				)
			]['totalHours'] = storeTotalHours;

			returnObj['currentStore']['totalHours'] = storeTotalHours;


			async.each(returnObj['users'], (item, cb) => {
				item['hoursPercent'] = ((item['totalHours'] / storeTotalHours) * 100);
				cb();
			}, (itemError) => {
				if(itemError) {
					throw next(itemError);
				}
			});

			callback(null);
		});
	};

    let setBudgets = (callback) => {
		sellingHoursModel.getAllBudgets((err, result) => {
			if(err) {
				throw next(err);
			}

			returnObj['budgets'] = result;

			callback(null);
		});
	};

	// async series
	async.series([
		setStores,
		setUsers,
		setUserTransactions,
		setHours,
		setBudgets
	], (err, results) => {

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
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = router;