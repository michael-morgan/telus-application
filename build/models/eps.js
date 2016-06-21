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