'use strict';

/**
 * Created by michael on 07/05/16.
 */
var connection = require('../connection');

exports.create = function (user, done) {
    connection.get().query('INSERT INTO `users` SET ?', [user], function (error, result) {
        if (error) {
            return done(error);
        }

        //TODO: add auto-increment id in users table for result.insertId
        done(null, null);
    });
};

exports.deleteById = function (id, done) {
    connection.get().query('DELETE FROM `users` WHERE `t_number` = ?', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

exports.deleteByIds = function (ids, done) {
    connection.get().query('DELETE FROM `users` WHERE `t_number` IN (?)', [ids], function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

exports.update = function (values, done) {
    connection.get().query('UPDATE `users` SET t_number = ?, first_name = ?, last_name = ?, email = ?, privileged = ? ' + 'WHERE t_number = ?', values, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.changedRows);
    });
};

exports.exists = function (username, done) {
    connection.get().query('SELECT `username` FROM `users` WHERE `username` = ?', username, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.emailExists = function (email, done) {
    connection.get().query('SELECT `email` FROM `users` WHERE `email` = ?', email, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getById = function (id, done) {
    connection.get().query('SELECT * FROM `users` WHERE `t_number` = ?', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getByName = function (username, done) {
    connection.get().query('SELECT * FROM `users` WHERE `username` = ?', username, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getStoreByTNum = function (t_number, done) {
    connection.get().query('SELECT `store_id` FROM `users` WHERE `t_number` = ?', t_number, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getAllUsersByStoreID = function (id, done) {
    connection.get().query('SELECT * FROM users INNER JOIN stores_util on users.t_number = stores_util.t_number WHERE stores_util.store_id = ? GROUP BY users.t_number', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getAllUsersByStoreIds = function (ids, done) {
    connection.get().query('SELECT * FROM users INNER JOIN stores_util on users.t_number = stores_util.t_number WHERE stores_util.store_id in (?) GROUP BY users.t_number', [ids], function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getAll = function (done) {
    connection.get().query('SELECT * FROM `users`', function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

//# sourceMappingURL=user.js.map