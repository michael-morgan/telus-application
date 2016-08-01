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

router.get('/', ensureAuthenticated, (req, res, next) => {
    renderTransactionHistoryPage({ title: 'Transaction History' }, req, res, next);
});

router.get('/add-transaction', ensureAuthenticated, (req, res, next) => {
    renderAddTransactionPage({title: 'Add Transaction'}, req, res, next);
}); //end get for /add-transaction

router.get('/add-transaction/:employee', ensureAuthenticated, (req, res, next) => {
    if (req.user.privileged <= 2) {
        return res.redirect('/users/');
    }

    renderAddTransactionPage({title: 'Add Transaction'}, req, res, next);
}); //End get for add-transaction/:employee

router.post('/', ensureAuthenticated, (req, res, next) => {
    let transactionId = req.body.id;

    transactionModel.deleteTransaction(transactionId, (err, result) => {
        if (err) {
            console.log('Error deleting transaction_id ' + transactionId + 'Error: ' + err.message);
            return res.end('Error: ' + err.message);
        }

        res.send(transactionId);
    });
});

//When the add transaction page is submitted
router.post('/add-transaction', ensureAuthenticated, (req, res, next) => {
    var returnObj = {
        title: 'Add Transaction'
    };

    if (req.body.employeeDropdown == undefined) {
        console.log("No user selected");
        returnObj['message'] = 'Please select a user';
        return renderAddTransactionPage(returnObj, req, res, next);
    }

    if (req.body.transactionDropdown == undefined) {
        console.log("No transaction selected");
        returnObj['message'] = 'Please select a transaction type';
        return renderAddTransactionPage(returnObj, req, res, next);
    }

    //Get all the data from the form
    let data = req.body;

    //For transactions
    let t_number = req.body.employeeDropdown;
    let store_id = undefined;
    let currentDate = undefined;
    let transaction_type = undefined;

    //For Transaction Items
    let activation_type = undefined;
    let device_type = undefined;
    let warranty_type = undefined;
    let attached = undefined;
    let revenue = 0;
    let num_of_accessories = undefined;
    let sbs_activation = undefined;

    //For Additional Metrics
    let hasMetrics = false;
    let hasItems = false;

    let learning_sessions = undefined;
    let learning_sessions_count = data.learningSessionsCount; // Get the value from the input

    //Assign corresponding id if the value is greater than 0
    if (learning_sessions_count > 0) {
        learning_sessions = 1;
        hasMetrics = true;
    }

    let credit_card = undefined;
    let credit_card_count = data.creditCardCount; // Get the value from the input

    //Assign corresponding id if the value is greater than 0
    if (credit_card_count > 0) {
        credit_card = 6;
        hasMetrics = true;
    }

    let appointments = undefined;
    let appointments_count = data.appointmentsCount; // Get the value from the input

    //Assign corresponding id if the value is greater than 0
    if (appointments_count > 0) {
        appointments = 3;
        hasMetrics = true;
    }

    let aotm = undefined;
    let aotm_count = data.aotmCount; // Get the value from the input

    //Assign corresponding id if the value is greater than 0
    if (aotm_count > 0) {
        aotm = 2;
        hasMetrics = true;
    }

    let critters = undefined;
    let critters_count = data.crittersCount; // Get the value from the input

    //Assign corresponding id if the value is greater than 0
    if (critters_count > 0) {
        critters = 4;
        hasMetrics = true;
    }

    let donations = undefined;
    let donations_count = data.donationsCount; // Get the value from the input

    //Assign corresponding id if the value is greater than 0
    if (donations_count > 0) {
        donations = 5;
        hasMetrics = true;
    }

    let transaction = undefined;
    let transaction_items = undefined;

    //Objects for metrics
    let learning_sessions_obj = undefined;
    let credit_card_obj = undefined;
    let appointments_obj = undefined;
    let aotm_obj = undefined;
    let critters_obj = undefined;
    let donations_obj = undefined;

    let metrics = undefined;

    transaction_items = data;

    //Call the following methods in order
    async.series([getStoreID, getData, addTransaction, addTransactionItems, addMetrics, pageRedirect]);


    /**
     * Second method in the async series
     * Get the users store number by their t_number
     * @param fnCallback
     */
    function getStoreID(fnCallback) {
        userModel.getById(t_number, (err, rows) => {
            if (err) {
                throw next(err);
            }
            else if (rows.length <= 0) {
                console.error('Invalid profile id.');
                return res.redirect('/users/');
            }
            else {
                store_id = rows[0].store_id;
                fnCallback(null);
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
            transaction_type: transaction_type
        };



        //Learning sessions object
        learning_sessions_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: learning_sessions,
            additional_metrics_items_count: learning_sessions_count
        };

        //Credit card object
        credit_card_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: credit_card,
            additional_metrics_items_count: credit_card_count
        };

        //Appointments object
        appointments_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: appointments,
            additional_metrics_items_count: appointments_count
        };

        //AOTM object
        aotm_obj = {
            additional_metrics_items_type: aotm,
            additional_metrics_items_count: aotm_count
        };

        //Critters object
        critters_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: critters,
            additional_metrics_items_count: critters_count
        };

        //Donations object
        donations_obj = {
            transaction_id: undefined,
            additional_metrics_items_type: donations,
            additional_metrics_items_count: donations_count
        };

        //Store the objects in an array for looping
        metrics = [learning_sessions_obj, credit_card_obj, appointments_obj, aotm_obj, critters_obj, donations_obj];

        fnCallback(null);
    }//end getData

    /**
     * Fourth method in the async series
     * @param fnCallback
     */
    function addTransaction(fnCallback) {
        //Add the transaction models and assign the insert ID to the other objects
        transactionModel.addTransaction(transaction, (err, result) => {
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
        hasItems = activation_type != undefined || device_type != undefined ||
            warranty_type != undefined || attached != 'no' || revenue != '' ||
            num_of_accessories != '0' || sbs_activation != 0;

        //If there are transaction items, insert record to the DB
        if (hasItems) {
            let transaction_item = {};

            //Add the object(s) to the database
            async.eachSeries(Object.keys(transaction_items), (item, callback) => {
                if(item.indexOf('activationDropdown') >= 0) {
                    transaction_item['activation_type'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('sbsActivation') >= 0) {
                    transaction_item['sbs_activation'] = 1;
                    callback(null);
                }
                else if(item.indexOf('deviceDropdown') >= 0) {
                    transaction_item['device_type'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('warrantyDropdown') >= 0) {
                    transaction_item['warranty_type'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('attachedDropdown') >= 0) {
                    transaction_item['attached'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('accessoryCount') >= 0) {
                    transaction_item['num_of_accessories'] = transaction_items[item];
                    callback(null);
                }
                else if(item.indexOf('revenue') >= 0) {
                    transaction_item['revenue'] = transaction_items[item];
                    if(transaction_item['revenue'] == ''){
                        transaction_item['revenue'] = 0.00;
                    }
                    transaction_item['transaction_id'] = transaction_items['transaction_id'];
                    if(transaction_item['sbs_activation'] == undefined){
                        transaction_item['sbs_activation'] = 0;
                    }
                    transactionModel.addTransactionItems(transaction_item, (err, result) => {
                        if (!err) {
                            callback(null);
                        } else {
                            callback(null);
                            console.log(err);
                        }
                    });
                }
                else {
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
            metrics.forEach((item) => {
                if (item.additional_metrics_items_count > 0) {
                    transactionModel.addAdditionalMetrics(item, (err, result) => {
                        if (!err) {
                            console.log(item + ' added');
                        } else {
                            console.log('Error!' + item + ' not added' + err);
                        }
                    });
                } else {
                    console.log(item + " not added");
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
        if(req.body.saveTransactionNew == undefined) {
            req.session.success = true;
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
    let date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + " " + hour + ":" + min + ":" + sec;
} //end getCurrentDate

/**
 * This method pulls all the data required to load the transaction history page from the database and loads the page
 * @param returnObj
 * @param req
 * @param res
 * @param next
 */
function renderTransactionHistoryPage(returnObj, req, res, next) {
    storeModel.getStoresByTNumber(req.user.t_number, (err, result) => {
        if(err) {
            throw next(err);
        } //end if

        returnObj['stores'] = result;

        transactionModel.getTransactionss((err, result) => {
            if(err) {
                throw next(err);
            } //end if

            returnObj['transactions'] = result;

            transactionModel.getTransactionTypes((err, result) => {
                if (err) {
                    throw next(err);
                } ///end if

                returnObj['transactionTypes'] = {};
                for(let index in result) {
                    if(!result.hasOwnProperty(index)) { continue; }
                    returnObj['transactionTypes'][result[index].transaction_type_id] = result[index].transaction_types;
                } //end for

                transactionModel.getTransactionItems((err, result) => {
                    if(err) {
                        throw next(err);
                    } //end if

                    returnObj['transactionItems'] = result;

                    transactionModel.getAdditionalMetricItems((err, result) => {
                        if (err) {
                            throw next(err);
                        } //end if

                        returnObj['additionalMetricItems'] = result;

                        transactionModel.getActivation((err, result) => {
                            if (err) {
                                throw next(err);
                            } //end if

                            returnObj['activationTypes'] = {};
                            for(let index in result) {
                                if(!result.hasOwnProperty(index)) { continue; }
                                returnObj['activationTypes'][result[index].activation_type_id] = result[index].activation_types;
                            } //end if

                            transactionModel.getDevice((err, result) => {
                                if (err) {
                                    throw next(err);
                                } //end if

                                returnObj['deviceTypes'] = {};
                                for(let index in result) {
                                    if(!result.hasOwnProperty(index)) { continue; }
                                    returnObj['deviceTypes'][result[index].device_type_id] = result[index].device_types;
                                } //end for

                                transactionModel.getWarranty((err, result) => {
                                    if (err) {
                                        throw next(err);
                                    } //end if

                                    returnObj['warrantyTypes'] = {};
                                    for(let index in result) {
                                        if(!result.hasOwnProperty(index)) { continue; }
                                        returnObj['warrantyTypes'][result[index].warranty_type_id] = result[index].warranty_types;
                                    } //end for

                                    returnObj['stores'].forEach((storeVal, storeIndex) => {
                                        returnObj['stores'][storeIndex]['transactions'] = returnObj['transactions'].filter(
                                            (transVal) => transVal.store_id === storeVal.store_id
                                        ); //end filter;

                                        returnObj['stores'][storeIndex]['transactions'].forEach((transVal, transIndex) => {
                                            returnObj['stores'][storeIndex]['transactions'][transIndex]['transactionItems'] = returnObj['transactionItems']
                                                .filter((transItemVal) => transItemVal.transaction_id === transVal.transaction_id);

                                            returnObj['stores'][storeIndex]['transactions'][transIndex]['additionalMetricItems'] = returnObj['additionalMetricItems']
                                                .filter((addMetricItemVal) => addMetricItemVal.transaction_id === transVal.transaction_id);

                                            returnObj['stores'][storeIndex]['transactions'][transIndex]['totalRevenue'] = 0;
                                            returnObj['stores'][storeIndex]
                                                ['transactions'][transIndex]['transactionItems'].forEach((transItemVal, transItemIndex) => {
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
                                                    ['transactionType'] = returnObj['transactionTypes'][transVal.transaction_type];
                                                returnObj['stores'][storeIndex]['transactions'][transIndex]['totalRevenue'] += transItemVal.revenue;
                                            }); //end for each
                                        }); //end for each
                                    }); //end for each

                                    returnObj['storesObj'] = JSON.stringify(returnObj['stores']);

                                    let storeIds = [];
                                    for(let storeIndex in returnObj['stores']) {
                                        if(!returnObj['stores'].hasOwnProperty(storeIndex)) { continue; }
                                        storeIds.push(returnObj['stores'][storeIndex].store_id);
                                    }

                                    userModel.getAllUsersByStoreIds(storeIds, (err, result) => {
                                            if(err) {
                                                throw next(err);
                                            } //end if

                                            //Display success message on adding a transaction
                                            if(req.session.success) {
                                                req.flash('success_messages', 'Transaction successfully added!');
                                                res.locals.success_messages = req.flash('success_messages');
                                                req.session.success = false;
                                            }  //end if

                                            returnObj['users'] = result;
                                            returnObj['usersObj'] = JSON.stringify(result);
                                            returnObj['selectedEmployee']= req.user.t_number;

                                            return res.render('transactions/transactions', returnObj);
                                    }); //getAllUsersByStoreID;
                                }); //getWarranty
                            }); //get devices
                        }); //end getActivation
                    }); //end getAdditionalMetricItems
                }); //end getTransactionItems
            }); //end getTransactionTypes
        }); //end getTransactions
    }); //end getStoresByTNumber
} //End renderTransactionHistoryPage

/**
 * This method pulls all the data required to load the add-transaction page from the database and loads the page
 * @param returnObj
 * @param req
 * @param res
 * @param next
 */
function renderAddTransactionPage(returnObj, req, res, next) {
    userModel.getAllUsersByStoreID(req.session.store_id, (err, userResult) => {
        //If an error is thrown
        if (err) {
            returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
            //Render the page wth error messages
            return res.render('transactions/add-transaction', returnObj);
        } //End if

        transactionModel.getTransactions((err, transactionResults) => {
            //If an error is thrown
            if (err) {
                returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                //Render the page wth error messages
                return res.render('transactions/add-transaction', returnObj);
            } //End if

            transactionModel.getActivation((err, activationResults) => {
                //If an error is thrown
                if (err) {
                    returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                    //Render the page wth error messages
                    return res.render('transactions/add-transaction', returnObj);
                } //End if

                transactionModel.getDevice((err, deviceResults) => {
                    //If an error is thrown
                    if (err) {
                        returnObj['message'] = req.flash('Our database servers maybe down. Please try again.');
                        //Render the page wth error messages
                        return res.render('transactions/add-transaction', returnObj);
                    } //End if

                    transactionModel.getWarranty((err, warrantyResults) => {
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

                        returnObj['warrentysObj'] = JSON.stringify(returnObj['warrantys']);
                        returnObj['devicesObj'] = JSON.stringify(returnObj['devices']);
                        returnObj['activationsObj'] = JSON.stringify(returnObj['activations']);

                        return res.render('transactions/add-transaction', returnObj);
                    }); //end getWarranty
                }); //end getDevice
            }); //end getActivation
        }); //end getTransactions
    }); //end getAll
} //End renderAddTransactionPage

module.exports = router;