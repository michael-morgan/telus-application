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

/**
# transaction_id, t_number,  store_id,  transaction_date,      transaction_type, activation_type, device_type, warranty_type,   attachments, revenue, number_of_accessories, sbs_return_exchange_discount, additional_metrics
'1',              't111111','6529',    '0016-02-01 00:00:00', 'Device',          'Renewal',       'Android',   'Device Care +', '1',         '750',   '4',                   'Not Applicable',             'Not Applicable'
**/

exports.create = function(transaction, done) {
    connection.get().query('INSERT INTO `transactions` SET ?', [transaction], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};
