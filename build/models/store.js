var connection = require('../connection');

exports.getStores = function(done) {
    connection.get().query('SELECT * FROM `stores`', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};