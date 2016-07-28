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
    connection.get().query('SELECT * FROM `stores_util` INNER JOIN `stores` ON stores_util.store_id = stores.store_id WHERE t_number = ? GROUP BY stores_util.store_id', id,function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.createStoresUtil = function(id,done) {
    connection.get().query('INSERT INTO stores_util SET ', id,function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.addStore = function(store, done) {
    connection.get().query('INSERT INTO stores_util (t_number, store_id) VALUES ?', [store], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, null);
    });
};