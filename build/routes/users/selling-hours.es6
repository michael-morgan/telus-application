/**
 * Created by Jacob on 2016-05-29.
 */
var express = require('express');
var connection = require('../../connection');
import * as utility from "../../utility";
var passport = require('passport');

var moment = require('../../bower_components/bootstrap-daterangepicker/moment.min.js');




var userModel = require('../../models/user');
var storeModel = require('../../models/store');
var sellingHoursModel = require('../../models/selling-hours');
var returnObj = {};
var router = express.Router();

var endOfWeek = moment().startOf('isoWeek').add(5,'day').format('YYYY-MM-DD');


router.get('/', ensureAuthenticated, function (req, res, next) {
    returnObj['message'] = undefined;
    let storeIds = [];

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
            sellingHoursModel.getAllHours(req.session.store_id,(err, result) => {
                if (err) {
                    throw next(err);
                } //end if)
                returnObj['hours'] = result;
                returnObj['hoursObj'] = JSON.stringify(result);
                if (req.session.success) {
                    req.flash('success_messages', 'success');
                    req.session.success = false;
                }  //end if

                sellingHoursModel.getBudgets(endOfWeek,(err, budgetResults) => {
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

router.post('/', ensureAuthenticated, (req, res, next) => {
    var data = req.body.name;
    data = data.split(',');
    //Update selling hours
    sellingHoursModel.updateHoursByID([req.body.value,data[0],data[1],data[2]], (err, result) => {
        if (err) {
            return res.end('Error: ' + err.message);
        }

        //No rows affected, guess we have to insert
        if(result == 0) {
            utility.log({ type: 'log', message: "Selling Hours: "+req.body.value });
            utility.log({ type: 'log', message: "team_member: "+ data[0] });
            utility.log({ type: 'log', message: "store_id: "+ data[1] });
            utility.log({ type: 'log', message: "date: "+ data[2] });

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
});


router.post('/budgets', ensureAuthenticated, (req, res, next) => {
    var data = req.body.name;
    data = data.split(',');

    utility.log({ type: 'log', message: data + 'store id from field' });

    sellingHoursModel.getBudgetsWithStore([endOfWeek,data[2]], (err, result) => {
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
        if(result != 0) {
            budget['CTs'] = result[0].CTs;
            budget['revenue'] = result[0].revenue;
            budget['aotm'] = result[0].aotm;
            budget['ls'] = result[0].ls;
        }

        var budgetType = data[0];
        switch(budgetType){
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
        if(result == 0){
            sellingHoursModel.createBudgets(budget, (err, result) => {
                if (err) {
                    return res.end('Error creating: ' + err.message);
                }
                res.send(JSON.stringify(req.body));
            });
        } else {
            sellingHoursModel.updateBudgets([budget['CTs'], budget['revenue'], budget['aotm'], budget['ls'], budget['date'], budget['store_id']], (err, result) => {
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
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

module.exports = router;