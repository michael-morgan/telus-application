var express = require('express');
var connection = require('../connection');
var passport = require('passport');

var userModel = require('./../models/user');
var epsModel = require('./../models/eps');

var router = express.Router();


// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
}

router.get('/', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    var returnObj = {
        title: 'EPS'
    };

    userModel.getAll(function(err, userResult) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
            //Render the page wth error messages
            return res.render('eps',returnObj);
        } //End if

        epsModel.getTransactions(function(err, transactionResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                return res.render('eps',returnObj);
            } //End if

            epsModel.getActivation(function(err, activationResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('eps',returnObj);
                } //End if

                epsModel.getDevice(function(err, deviceResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('eps',returnObj);
                    } //End if

                    epsModel.getWarranty(function(err, warrantyResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('eps',returnObj);
                        } //End if

                        returnObj['users'] = userResult;
                        returnObj['transactions'] = transactionResults;
                        returnObj['activations'] = activationResults;
                        returnObj['devices'] = deviceResults;
                        returnObj['warrantys'] = warrantyResults;
                        return res.render('eps', returnObj);
                    }); //end getWarranty
                }); //end getDevice
            }); //end getActivation
        }); //end getTransactions
    }); //end getAll
}); //end get for /


router.get('/:employee', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    var returnObj = {
        title: 'EPS'
    };

    userModel.getAll(function(err, userResult) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
            //Render the page wth error messages
            return res.render('eps',returnObj);
        } //End if

        epsModel.getTransactions(function(err, transactionResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                return res.render('eps',returnObj);
            } //End if

            epsModel.getActivation(function(err, activationResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('eps',returnObj);
                } //End if

                epsModel.getDevice(function(err, deviceResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('eps',returnObj);
                    } //End if

                    epsModel.getWarranty(function(err, warrantyResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('eps',returnObj);
                        } //End if

                        returnObj['users'] = userResult;
                        returnObj['transactions'] = transactionResults;
                        returnObj['activations'] = activationResults;
                        returnObj['devices'] = deviceResults;
                        returnObj['warrantys'] = warrantyResults;
                        returnObj['selectedEmployee'] = req.params.employee;
                        return res.render('eps', returnObj);
                    }); //end getWarranty
                }); //end getDevice
            }); //end getActivation
        }); //end getTransactions
    }); //end getAll
});



router.post('/', ensureAuthenticated, function (req, res, next) {

   var t_number = req.body.employeeDropdown;
   var store_id = userModel.getById(t_number, function(err, rows) {
        if(err) {
            throw next(err);
        }
        else if(rows.length <= 0) {
            console.error('Invalid profile id.');
            return res.redirect('/users/');
        }
        else {
            store_id = rows[0].store_id;
            return store_id;
        }
    });


   var currentDate = getCurrentDate();
   var transaction_type = req.body.transactionDropdown;
   var activation_type = req.body.activationDropdown;
   var device_type = req.body.deviceDropdown;
   var warranty_type = req.body.warrantyDropdown;
  // var attachments = undefined;
   //var num_of_accessories = undefined;
  // var sbs_return_exchange_discount = undefined;
   //var additional_metrics = undefined;


   var transaction = {
        t_number: t_number,
        store_id: store_id,
        transaction_date: currentDate,
        transaction_type: transaction_type,
        activation_type: activation_type,
        device_type: device_type,
        warranty_type: warranty_type,
        //attachments: attachments,
        //num_of_accessories: num_of_accessories,
        //sbs_return_exchange_discount: sbs_return_exchange_discount,
        //additional_metrics:  additional_metrics
    }

    console.log(transaction);



});


/**
 * Custom function that return the current date and time
 * @returns {string} in yyyy:mm:dd hh:mm:ss format
 */
function getCurrentDate() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var today = year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;

    return today;
}



module.exports = router;