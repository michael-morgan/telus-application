'use strict';

var connection = require('../connection');

exports.getStores = function (done) {
    connection.get().query('SELECT * FROM `stores`', function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getStoresUtil = function (done) {
    connection.get().query('SELECT * FROM `stores_util`', function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getStoresByTNumber = function (id, done) {
    connection.get().query('SELECT * FROM `stores_util` ' + 'INNER JOIN `stores` ON stores_util.store_id = stores.store_id ' + 'WHERE t_number = ? GROUP BY stores_util.store_id', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getFirstStoreByTNumber = function (id, done) {
    connection.get().query('SELECT * FROM `stores_util` ' + 'INNER JOIN `stores` ON stores_util.store_id = stores.store_id ' + 'WHERE t_number = ? GROUP BY stores_util.store_id LIMIT 1', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getUsersByStoreId = function (id, done) {
    connection.get().query('SELECT first_name, last_name, users.t_number FROM `users` ' + 'INNER JOIN `stores_util` ON users.t_number = stores_util.t_number ' + 'WHERE store_id = ?', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.addStore = function (store, done) {
    connection.get().query('INSERT INTO stores_util (t_number, store_id) VALUES ?', [store], function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, null);
    });
};

exports.deleteStores = function (id, done) {
    connection.get().query('DELETE FROM stores_util WHERE t_number = ?', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

//# sourceMappingURL=store.js.map