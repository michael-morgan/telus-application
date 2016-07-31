'use strict';

/**
 * Created by michael on 07/05/16.
 */
var connection = require('../connection');

exports.create = function (observation, done) {
    connection.get().query('INSERT INTO `observations` SET ?', [observation], function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.deleteById = function (id, done) {
    connection.get().query('DELETE FROM `observations` WHERE `observation_id` = ?', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

//# sourceMappingURL=observation.js.map