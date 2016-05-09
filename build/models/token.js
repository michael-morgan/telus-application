/**
 * Created by michael on 07/05/16.
 */
var connection = require('../connection');

exports.create = function(token, done) {
    connection.get().query('INSERT INTO `tokens` SET ?', [token], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.deleteById = function(token, done) {
    connection.get().query('DELETE * FROM `tokens` WHERE `token` = ?', [token], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

exports.deleteByIds = function(tokens, done) {
    connection.get().query('DELETE * FROM `tokens` WHERE `token` IN (?)', [tokens], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

exports.getById = function(token, done) {
    connection.get().query('SELECT * FROM `tokens` WHERE `token` = ?', token, function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};