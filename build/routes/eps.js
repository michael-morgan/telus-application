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


module.exports = router;