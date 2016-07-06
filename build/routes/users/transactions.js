var express = require('express');
var connection = require('../../connection');
var passport = require('passport');
var async = require('async');

var userModel = require('../../models/user');
var storeModel = require('../../models/store');
var transactionModel = require('../../models/transactions');

var router = express.Router();

// Ensure sure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


router.get('/', ensureAuthenticated, function (req, res, next) {
    var returnObj = { title: 'Transaction History' };

    storeModel.getStores(function(err, result) {
        if(err) {
            throw next(err);
        }

        returnObj['stores'] = result;

        transactionModel.getTransactionss(function(err, result) {
            if(err) {
                throw next(err);
            }

            returnObj['transactions'] = result;

            transactionModel.getTransactionTypes(function (err, result) {
                if (err) {
                    throw next(err);
                }

                returnObj['transactionTypes'] = {};
                for(var index in result) {
                    returnObj['transactionTypes'][result[index].transaction_type_id] = result[index].transaction_types;
                }

                transactionModel.getTransactionItems(function(err, result) {
                    if(err) {
                        throw next(err);
                    }

                    returnObj['transactionItems'] = result;

                    transactionModel.getAdditionalMetricItems(function(err, result) {
                        if (err) {
                            throw next(err);
                        }

                        returnObj['additionalMetricItems'] = result;

                        transactionModel.getActivation(function (err, result) {
                            if (err) {
                                throw next(err);
                            }

                            returnObj['activationTypes'] = {};
                            for(var index in result) {
                                returnObj['activationTypes'][result[index].activation_type_id] = result[index].activation_types;
                            }

                            transactionModel.getDevice(function (err, result) {
                                if (err) {
                                    throw next(err);
                                }

                                returnObj['deviceTypes'] = {};
                                for(var index in result) {
                                    returnObj['deviceTypes'][result[index].device_type_id] = result[index].device_types;
                                }

                                transactionModel.getWarranty(function (err, result) {
                                    if (err) {
                                        throw next(err);
                                    }

                                    returnObj['warrantyTypes'] = {};
                                    for(var index in result) {
                                        returnObj['warrantyTypes'][result[index].warranty_type_id] = result[index].warranty_types;
                                    }

                                    returnObj['stores'].forEach(function(storeVal, storeIndex) {
                                        returnObj['stores'][storeIndex]['transactions'] = returnObj['transactions'].filter(function(transVal) {
                                            return transVal.store_id === storeVal.store_id;
                                        });

                                        returnObj['stores'][storeIndex]['transactions'].forEach(function(transVal, transIndex) {
                                            returnObj['stores'][storeIndex]['transactions'][transIndex]['transactionItems'] = returnObj['transactionItems']
                                            .filter(function(transItemVal) {
                                                return transItemVal.transaction_id === transVal.transaction_id;
                                            });

                                            returnObj['stores'][storeIndex]['transactions'][transIndex]['additionalMetricItems'] = returnObj['additionalMetricItems']
                                            .filter(function(addMetricItemVal) {
                                                return addMetricItemVal.transaction_id === transVal.transaction_id;
                                            });

                                            returnObj['stores'][storeIndex]['transactions'][transIndex]['totalRevenue'] = 0;
                                            returnObj['stores'][storeIndex]
                                                ['transactions'][transIndex]['transactionItems'].forEach(function(transItemVal, transItemIndex) {
                                                returnObj['stores'][storeIndex]
                                                    ['transactions'][transIndex]
                                                    ['transactionItems'][transItemIndex]
                                                    ['activation'] = returnObj['activationTypes'][transItemVal.activation_type];
                                                returnObj['stores'][storeIndex]
                                                    ['transactions'][transIndex]
                                                    ['transactionItems'][transItemIndex]
                                                    ['device'] = returnObj['deviceTypes'][transItemVal.device_type];
                                                returnObj['stores'][storeIndex]
                                                    ['transactions'][transIndex]
                                                    ['transactionItems'][transItemIndex]
                                                    ['warranty'] = returnObj['warrantyTypes'][transItemVal.warranty_type];
                                                returnObj['stores'][storeIndex]
                                                    ['transactions'][transIndex]
                                                    ['transactionItems'][transItemIndex]
                                                    ['transaction'] = returnObj['transactionTypes'][transItemVal.transaction_id];
                                                returnObj['stores'][storeIndex]['transactions'][transIndex]['totalRevenue'] += transItemVal.revenue;
                                            });
                                        });
                                    });

                                    returnObj['storesObj'] = JSON.stringify(returnObj['stores']);

                                    userModel.getAll(function(err, result) {
                                        if(err) {
                                            throw next(err);
                                        }

                                        returnObj['users'] = result;
                                        return res.render('transactions/transactions', returnObj);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

/********************************************************************************************
 ADD TRANSACTION
 ********************************************************************************************/
router.get('/add-transaction', ensureAuthenticated, function (req, res, next) {
    var returnObj = {
        title: 'Add Transaction'
    };

    renderPage(returnObj, req, res, next);


}); //end get for /add-transaction

router.get('/add-transaction/:employee', ensureAuthenticated, function (req, res, next) {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    var returnObj = {
        title: 'Add Transaction'
    };


    renderPage(returnObj, req, res, next);

}); //End get for add-transaction/:employee

router.post('/', ensureAuthenticated, function (req, res, next) {
    console.log(req.body.id);
    var transactionId = req.body.id;
    transactionModel.deleteTransaction(transactionId, function(err, result) {
        if (err) {
            console.log('Error deleting transaction_id ' + transactionId + 'Error: ' + err.message);
            return res.end('Error: ' + err.message);
        }
        console.log('Removing transaction ' + transactionId);
        res.send(transactionId);
    });
});

//When the add transaction page is submitted
router.post('/add-transaction', ensureAuthenticated, function (req, res, next) {
    var returnObj = {
        title: 'Add Transaction'
    };

    if (req.body.employeeDropdown == undefined) {
        console.log("No user selected");
        returnObj['message'] = 'Please select a user';
        return renderPage(returnObj, req, res, next);
    }

    if (req.body.transactionDropdown == undefined) {
        console.log("No transaction selected");
        returnObj['message'] = 'Please select a transaction type';
        return renderPage(returnObj, req, res, next);
    }

    //Get all the data from the form
    var data = req.body;

    //For transactions
    var t_number = undefined;
    var store_id = undefined;
    var currentDate = undefined;
    var transaction_type = undefined;

    //For Transaction Items
    var activation_type = undefined;
    var device_type = undefined;
    var warranty_type = undefined;
    var attached = undefined;
    var revenue = 0;
    var num_of_accessories = undefined;
    var sbs_activation = undefined;

    //For Additional Metrics
    var hasMetrics = false;
    var hasItems = false;

    var learning_sessions = undefined;
    var learning_sessions_count = data.learningSessionsCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (learning_sessions_count > 0) {
        learning_sessions = 1;
        hasMetrics = true;
    }

    var credit_card = undefined;
    var credit_card_count = data.creditCardCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (credit_card_count > 0) {
        credit_card = 6;
        hasMetrics = true;
    }

    var appointments = undefined;
    var appointments_count = data.appointmentsCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (appointments_count > 0) {
        appointments = 3;
        hasMetrics = true;
    }

    var aotm = undefined;
    var aotm_count = data.aotmCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (aotm_count > 0) {
        aotm = 2;
        hasMetrics = true;
    }

    var critters = undefined;
    var critters_count = data.crittersCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (critters_count > 0) {
        critters = 4;
        hasMetrics = true;
    }

    var donations = undefined;
    var donations_count = data.donationsCount; // Get the value from the input
    //Assign corresponding id if the value is greater than 0
    if (donations_count > 0) {
        donations = 5;
        hasMetrics = true;
    }

    var transaction = undefined;
    var transaction_items = undefined;

    //Objects for metrics
    var learning_sessions_obj = undefined;
    var credit_card_obj = undefined;
    var appointments_obj = undefined;
    var aotm_obj = undefined;
    var critters_obj = undefined;
    var donations_obj = undefined;

    var metrics = undefined;

    transaction_items = data;


    //Call the following methods in order
    async.series([getTNumber, getStoreID, getData, addTransaction, addTransactionItems, addMetrics, pageRedirect]);


    /**
     * First method in the async series
     * Assigned t_number
     * @param fnCallback
     */
    function getTNumber(fnCallback) {
        t_number = req.body.employeeDropdown;

        fnCallback(null);
    }


    /**
     * Second method in the async series
     * Get the users store number by their t_number
     * @param fnCallback
     */
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
    } //End getStoreID

    /**
     * Third method in the async series
     * Gets all the data from the form and stores it in objects
     * @param fnCallback
     */
    function getData(fnCallback) {
        currentDate = getCurrentDate();
        transaction_type = data.transactionDropdown;

        //Transaction Items
        activation_type = data.activationDropdown;
        device_type = data.deviceDropdown;
        warranty_type = data.warrantyDropdown;
        attached = data.attachedDropdown;

        if (data.revenueText != '') {
            revenue = data.revenueText;
        }

        num_of_accessories = data.accessoryCount;

        if (data.sbsActivation == "on") {
            sbs_activation = 1;
        } else {
            sbs_activation = 0;
        }

        //Transaction object
        transaction = {
            t_number: t_number,
            store_id: store_id,
            transaction_date: currentDate,
            transaction_type: transaction_type,
        };



        //Learning sessions object
        learning_sessions_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: learning_sessions,
            additional_metrics_items_count: learning_sessions_count,
        };

        //Credit card object
        credit_card_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: credit_card,
            additional_metrics_items_count: credit_card_count,
        };

        //Appointments object
        appointments_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: appointments,
            additional_metrics_items_count: appointments_count,
        };

        //AOTM object
        aotm_obj = {
            additional_metrics_items_type: aotm,
            additional_metrics_items_count: aotm_count,
        };

        //Critters object
        critters_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: critters,
            additional_metrics_items_count: critters_count,
        };

        //Donations object
        donations_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: donations,
            additional_metrics_items_count: donations_count
        };


        //Store the objects in an array for looping
        metrics = [learning_sessions_obj, credit_card_obj, appointments_obj, aotm_obj, critters_obj, donations_obj]
        fnCallback(null);
    }//end getData

    /**
     * Fourth method in the async series
     * @param fnCallback
     */

    function addTransaction(fnCallback) {
        //Add the transaction models and assign the insert ID to the other objects
        transactionModel.addTransaction(transaction, function (err, result) {
            transaction_items['transaction_id'] = result.insertId;
            learning_sessions_obj['transaction_id'] = result.insertId;
            credit_card_obj['transaction_id'] = result.insertId;
            appointments_obj['transaction_id'] = result.insertId;
            aotm_obj['transaction_id'] = result.insertId;
            critters_obj['transaction_id'] = result.insertId;
            donations_obj['transaction_id'] = result.insertId;
            fnCallback(null);
        });
    } //End addTransaction

    /**
     * Fifth method in the async series
     * Add the transaction items, if there are some
     * @param fnCallback
     */

    function addTransactionItems(fnCallback) {

        //Check if any of the these fields have be filled out, to know if we are inserting or not
        if (activation_type != undefined || device_type != undefined || warranty_type != undefined || attached != 'no' || revenue != '' || num_of_accessories != '0' || sbs_activation != 0) {
            hasItems = true
        }

        //If there are transaction items, insert record to the DB
        if (hasItems) {
            var transaction_item = {};
            //Add the object(s) to the database
            async.eachSeries(Object.keys(transaction_items), function (item, callback) {
                if(item.indexOf('activationDropdown') >= 0)
                {
                    transaction_item['activation_type'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('sbsActivation') >= 0)
                {
                    transaction_item['sbs_activation'] = 1;
                    callback(null);
                }
                else if(item.indexOf('deviceDropdown') >= 0)
                {
                    transaction_item['device_type'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('warrantyDropdown') >= 0)
                {
                    transaction_item['warranty_type'] = transaction_items[item];
                    callback(null);
                }

                else if(item.indexOf('attachedDropdown') >= 0)
                {
                    transaction_item['attached'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('accessoryCount') >= 0)
                {
                    transaction_item['num_of_accessories'] = transaction_items[item];
                    transaction_item['transaction_id'] = transaction_items['transaction_id'];
                    transaction_item['revenue'] = revenue;
                    if(transaction_item['sbs_activation'] == undefined)
                        transaction_item['sbs_activation'] =0;
                    transactionModel.addTransactionItems(transaction_item, function (err, result) {
                        if (!err) {
                            callback(null);
                        } else {
                            callback(null);
                        }
                    });
                }
                else
                {
                   callback(null);
                }
            });
        } else {
            console.log("No Items");
        }
        fnCallback(null);
    } //End Transaction Items


    /**
     * Sixth method in the async series
     * Add any additional metrics te transaction may have
     * @param fnCallback
     */

    function addMetrics(fnCallback) {
        if (hasMetrics) {
            console.log("Additional Metrics");

            //Foreach object in the array of metrics objects
            metrics.forEach(function (item) {
                if (item.additional_metrics_items_count > 0) {
                    transactionModel.addAdditionalMetrics(item, function (err, result) {
                        if (!err) {
                            console.log(item + ' added')
                        } else {
                            console.log('Error!' + item + ' not added' + err)
                        }
                    });
                } else {
                    console.log(item + " not added")
                }
            });

        } else {
            console.log("No Metrics");
        }

        fnCallback(null);
    } //End addMetrics

    /**
     * Seventh and last method in the async series
     * Simply redirect to the summary page
     * @param fnCallback
     */

    function pageRedirect(fnCallback) {
        if(req.body.saveTransactionNew == undefined){
            res.redirect('/users/transactions');
        } else {
            res.redirect('/users/transactions/add-transaction');
        }

        fnCallback(null);
    }

}); //end post for add-transaction


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
} //end getCurrentDate

/**
 * This method pull all the data required to load the transaction page from the database and loads the page
 * @param returnObj
 * @param req
 * @param res
 * @param next
 */
function renderPage(returnObj, req, res, next) {
    userModel.getAll(function (err, userResult) {
        //If an error is thrown
        if (err) {
            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
            //Render the page wth error messages
            return res.render('transactions/add-transaction', returnObj);
        } //End if

        transactionModel.getTransactions(function (err, transactionResults) {
            //If an error is thrown
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                return res.render('transactions/add-transaction', returnObj);
            } //End if

            transactionModel.getActivation(function (err, activationResults) {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('transactions/add-transaction', returnObj);
                } //End if

                transactionModel.getDevice(function (err, deviceResults) {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('transactions/add-transaction', returnObj);
                    } //End if

                    transactionModel.getWarranty(function (err, warrantyResults) {
                        //If an error is thrown
                        if (err) {
                            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                            //Render the page wth error messages
                            return res.render('transactions/add-transaction', returnObj);
                        } //End if

                        returnObj['users'] = userResult;
                        returnObj['transactions'] = transactionResults;
                        returnObj['activations'] = activationResults;
                        returnObj['devices'] = deviceResults;
                        returnObj['warrantys'] = warrantyResults;
                        returnObj['selectedEmployee'] = req.user.t_number;
                        return res.render('transactions/add-transaction', returnObj);
                    }); //end getWarranty
                }); //end getDevice
            }); //end getActivation
        }); //end getTransactions
    }); //end getAll
} //End renderPage


module.exports = router;