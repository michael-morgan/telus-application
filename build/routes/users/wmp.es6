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

    returnObj['title'] = 'Selling Hours';
    returnObj['message'] = undefined;

    storeModel.getStoresByTNumber(req.user.t_number, (err, result) => {
        if (err) {
            throw next(err);
        } //end if

        let storesResult = result;

        returnObj['stores'] = storesResult;
        returnObj['currentStore'] = storesResult.find((store) => store.store_id == req.session.store_id);
        returnObj['storesObj'] = JSON.stringify(returnObj['stores']);

        let storeIds = [];
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

            sellingHoursModel.getHoursByStoreId(req.session.store_id, (err, result) => {
                if (err) {
                    throw next(err);
                } //end if

                let hoursResult = result;

                returnObj['hours'] = hoursResult;
                returnObj['hoursObj'] = JSON.stringify(hoursResult);

                let storeTotalHours = 0;
                returnObj['users'].forEach((user, userIndex, userArray) => {
                    if(user.privileged == 5) { return; }

                    userArray[userIndex]['hours'] = hoursResult.filter((row) => row.team_member == user.t_number);

                    let total = 0;
                    for (let hourIndex in userArray[userIndex]['hours']) {
                        total += userArray[userIndex]['hours'][hourIndex].selling_hours;
                    }

                    userArray[userIndex]['totalHours'] = total;
                    storeTotalHours += total;
                });

                returnObj['stores'][returnObj['stores'].findIndex(
                    (store) => store.store_id == req.session.store_id
                )]['totalHours'] = storeTotalHours;
                returnObj['currentStore']['totalHours'] = storeTotalHours;

                returnObj['users'].forEach((user, userIndex, userArray) => {
                    userArray[userIndex]['hoursPercent'] = ((userArray[userIndex]['totalHours'] / storeTotalHours) * 100);
                });

                res.render('wmp', returnObj);
            });
        });
    });
});

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}
module.exports = router;