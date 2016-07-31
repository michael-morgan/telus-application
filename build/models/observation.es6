/**
 * Created by michael on 07/05/16.
 */
var connection = require('../connection');

exports.create = (observation, done) => {
    connection.get().query('INSERT INTO `observations` SET ?', [observation], (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.deleteById = (id, done) => {
    connection.get().query('DELETE FROM `observations` WHERE `observation_id` = ?', id, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};