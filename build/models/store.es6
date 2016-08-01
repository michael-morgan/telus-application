var connection = require('../connection');

exports.getStores = done => {
    connection.get().query('SELECT * FROM `stores`', (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getStoresByTNumber = (id, done) => {
    connection.get().query('SELECT * FROM `stores_util` ' +
                        'INNER JOIN `stores` ON stores_util.store_id = stores.store_id ' +
                        'WHERE t_number = ? GROUP BY stores_util.store_id', id, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.createStoresUtil = (id, done) => {
    connection.get().query('INSERT INTO stores_util SET ', id, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.addStore = (store, done) => {
    connection.get().query('INSERT INTO stores_util (t_number, store_id) VALUES ?', [store], (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, null);
    });
};

exports.getFirstStoreByTNumber = (id, done) => {
    connection.get().query('SELECT * FROM `stores_util` ' +
        'INNER JOIN `stores` ON stores_util.store_id = stores.store_id ' +
        'WHERE t_number = ? GROUP BY stores_util.store_id LIMIT 1', id, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getUsersByStoreId = (id, done) => {
    connection.get().query('SELECT first_name, last_name, users.t_number FROM `users` ' +
        'INNER JOIN `stores_util` ON users.t_number = stores_util.t_number ' +
        'WHERE store_id = ?', id, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};