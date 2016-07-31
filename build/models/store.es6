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