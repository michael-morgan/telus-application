var connection = require('../connection');

exports.getTransactions = function(done) {
    connection.get().query('SELECT * FROM transaction_types', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getTransactionss = function(done) {
    connection.get().query('SELECT * FROM transactions', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getTransactionItems = function(done) {
    connection.get().query('SELECT * FROM transaction_items', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getAdditionalMetricItems = function(done) {
    connection.get().query('SELECT * FROM addition_metrics_items', function(error, result) {
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

exports.getTransactionTypes = function(done) {
    connection.get().query('SELECT * FROM transaction_types', function(error, result) {
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
    connection.get().query('INSERT INTO `transaction_items`  SET ?', [transactions_items], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};
exports.deleteTransaction  = function(id, done) {
    connection.get().query('DELETE FROM `transaction_items` WHERE transaction_id = ?', id, function(error, result) {
        if(error) {
            return done(error);
        }
        connection.get().query('DELETE FROM `transactions` WHERE transaction_id = ?', id, function(error, result) {
            if(error) {
                return done(error);
            }

            done(null, result);
        });
        done(null, result);
    });
};
exports.addAdditionalMetrics = function(metrics, done) {
    connection.get().query('INSERT INTO `addition_metrics_items` SET ?', [metrics], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};
