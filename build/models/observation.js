/**
 * Created by michael on 07/05/16.
 */
var connection = require('../connection');

exports.create = function(observation, done) {
    connection.get().query('INSERT INTO `observations` SET ?', [observation], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};