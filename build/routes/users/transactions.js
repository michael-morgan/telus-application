var express = require('express');
var connection = require('../../connection');
var passport = require('passport');
var async = require('async');

var userModel = require('../../models/user');
var transactionModel = require('../../models/transactions');

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

    res.render('transactions/transactions', {
        title: 'Transaction History'
    });
});

//ADD TRANSACTION
router.get('/add-transaction', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }


    var returnObj = {
        title: 'Add Transaction'
    };




    userModel.getAll(function(err, userResult) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
            //Render the page wth error messages
            return res.render('transactions/add-transaction',returnObj);
        } //End if

        transactionModel.getTransactions(function(err, transactionResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                return res.render('transactions/add-transaction',returnObj);
            } //End if

            transactionModel.getActivation(function(err, activationResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('transactions/add-transaction',returnObj);
                } //End if

                transactionModel.getDevice(function(err, deviceResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('transactions/add-transaction',returnObj);
                    } //End if

                    transactionModel.getWarranty(function(err, warrantyResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('transactions/add-transaction',returnObj);
                        } //End if

                        returnObj['users'] = userResult;
                        returnObj['transactions'] = transactionResults;
                        returnObj['activations'] = activationResults;
                        returnObj['devices'] = deviceResults;
                        returnObj['warrantys'] = warrantyResults;
                        return res.render('transactions/add-transaction', returnObj);
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
        title: 'Add Transaction'
    };

    userModel.getAll(function(err, userResult) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
            //Render the page wth error messages
            return res.render('transactions/add-transaction',returnObj);
        } //End if

        transactionModel.getTransactions(function(err, transactionResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                return res.render('transactions/add-transaction',returnObj);
            } //End if

            transactionModel.getActivation(function(err, activationResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('transactions/add-transaction',returnObj);
                } //End if

                transactionModel.getDevice(function(err, deviceResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('transactions/add-transaction',returnObj);
                    } //End if

                    transactionModel.getWarranty(function(err, warrantyResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('transactions/add-transaction',returnObj);
                        } //End if

                        returnObj['users'] = userResult;
                        returnObj['transactions'] = transactionResults;
                        returnObj['activations'] = activationResults;
                        returnObj['devices'] = deviceResults;
                        returnObj['warrantys'] = warrantyResults;
                        returnObj['selectedEmployee'] = req.params.employee;
                        return res.render('transactions/add-transaction', returnObj);
                    }); //end getWarranty
                }); //end getDevice
            }); //end getActivation
        }); //end getTransactions
    }); //end getAll
});



router.post('/add-transaction', ensureAuthenticated, function (req, res, next) {
    if(req.body.employeeDropdown == undefined){
        return res.redirect('/users/transactions/add-transaction');
    }

    if(req.body.transactionDropdown == undefined){
        return res.redirect('/users/transactions/add-transaction');
    }



    //Get all the data from the form
    var data = req.body;
    console.log(data);

    //For transactions
    var t_number = undefined;
    var store_id = undefined
    var currentDate = undefined;
    var transaction_type = undefined;

    //For Transaction Items
    var activation_type = undefined;
    var device_type = undefined;
    var warranty_type = undefined;
    var attached = undefined;
    var num_of_accessories = undefined;
    var sbs_activation = undefined;

    //For additional metrics

    var hasMetrics = false;
    var hasItems = false;

    var learning_sessions = undefined
    var learning_sessions_count = data.learningSessionsCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (learning_sessions_count > 0){
        learning_sessions = 1;
        hasMetrics = true;
    }

    var credit_card = undefined
    var credit_card_count = data.creditCardCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (credit_card_count > 0){
        credit_card = 6;
        hasMetrics = true;
    }

    var appointments = undefined
    var appointments_count = data.appointmentsCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (appointments_count > 0){
        appointments = 3;
        hasMetrics = true;
    }

    var aotm = undefined
    var aotm_count = data.aotmCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (aotm_count > 0){
        aotm = 2;
        hasMetrics = true;
    }

    var critters = undefined
    var critters_count = data.crittersCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (critters_count > 0){
        critters = 4;
        hasMetrics = true;
    }

    var donations = undefined
    var donations_count = data.donationsCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (donations_count > 0){
        donations = 5;
        hasMetrics = true;
    }

    var transaction = undefined;
    var transaction_items = undefined;
    var addition_metrics = undefined;

    async.series([getTNumber, getStoreID, getData, addTransaction, addTransactionItems, addMetrics]);


    function getTNumber(fnCallback){
        t_number = req.body.employeeDropdown;

        fnCallback(null);
    }


    function getStoreID(fnCallback) {
        store_id = userModel.getById(t_number, function (err, rows) {
            if (err) {
                throw next(err);
            }
            else if (rows.length <= 0) {
                console.error('Invalid profile id.');
                fnCallback(null);
                return res.redirect('/users/');

            }
            else {
                store_id = rows[0].store_id;
                fnCallback(null);
                return store_id;
            }
        });

    }
    function getData(fnCallback){
        currentDate = getCurrentDate();
        transaction_type = data.transactionDropdown;

        //Transaction Items
        activation_type = data.activationDropdown;
        device_type = data.deviceDropdown;
        warranty_type = data.warrantyDropdown;
        attached = data.attachedDropdown;
        num_of_accessories = data.accessoryCount;

        if(data.sbsActivation == "on"){
            sbs_activation = 1;
        } else {
            sbs_activation = 0;
        }





        transaction = {
            t_number: t_number,
            store_id: store_id,
            transaction_date: currentDate,
            transaction_type: transaction_type,
        };

        transaction_items = {
            transaction_id: undefined,
            activation_type: activation_type,
            device_type: device_type,
            warranty_type: warranty_type,
            attached: attached,
            num_of_accessories: num_of_accessories,
            sbs_activation: sbs_activation,
        };

        addition_metrics = {
            learning_sessions: learning_sessions,
            learning_sessions_count: learning_sessions_count,

            credit_card: credit_card,
            credit_card_count: credit_card_count,

            appointments: appointments,
            appointments_count: appointments_count,

            aotm: aotm,
            aotm_count: aotm_count,

            critters: critters,
            critter_count: critters_count,

            donations: donations,
            donations_count: donations_count
        };


        fnCallback(null);
    }

    function addTransaction(fnCallback){

        console.log("Transaction");
        console.log(transaction);



        transactionModel.addTransaction(transaction, function(err, result) {
            transaction_items['transaction_id'] = result.insertId;
            console.log(transaction_items.transaction_id);
            console.log(result.insertId);
            addition_metrics['transaction_id'] = result.insertId;
            fnCallback(null);
        });
    }

    function addTransactionItems(fnCallback){

        if(activation_type != undefined || device_type != undefined || warranty_type != undefined || attached != 'no' || num_of_accessories != '0' || sbs_activation != undefined){
            hasItems = true
        }

        if(hasItems){
            console.log("Transaction Items");
            console.log(transaction_items);

            transactionModel.addTransactionItems(transaction_items, function(err, result) {
                if(!err){
                    console.log('Items added')
                } else {
                    console.log('Items not added' + err)
                }

            });
        } else{
            console.log("No Items");
        }

        fnCallback(null);
    }


    function addMetrics(fnCallback){
        if(hasMetrics){
            console.log("Additional Metrics");
            console.log(addition_metrics);

            //transactionModel.addAdditionalMetrics(addition_metrics, function(err, result) {

            //});
        } else{
            console.log("No Metrics");
        }

        fnCallback(null);
    }

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