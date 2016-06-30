var connection = require('../connection');

exports.getTransactions = function(done) {
    connection.get().query('SELECT * FROM transaction_types', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getActivation = function(done) {
    connection.get().query('SELECT * FROM activation_types', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getDevice = function(done) {
    connection.get().query('SELECT * FROM device_types', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getWarranty = function(done) {
    connection.get().query('SELECT * FROM warranty_types', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.getSbs = function(done) {
    connection.get().query('SELECT * FROM sbs_returns_exchanges_discounts', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.addTransaction = function(transactions, done) {
    connection.get().query('INSERT INTO `transactions` SET ?', [transactions], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.addTransactionItems = function(transactions_items, done) {
    connection.get().query('INSERT INTO `transaction_items` SET ?', [transactions_items], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.addAdditionalMetrics = function(metrics, done) {
    connection.get().query('INSERT INTO `additional_metric_items` SET ?', [metrics], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};
