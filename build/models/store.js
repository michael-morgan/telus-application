var connection = require('../connection');

exports.getStores = function(done) {
    connection.get().query('SELECT * FROM `stores`', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getStoresByTNumber = function(id,done) {
    connection.get().query('SELECT * FROM `stores` INNER JOIN `users` ON stores.store_id = users.store_id WHERE t_number = ?', id,function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};