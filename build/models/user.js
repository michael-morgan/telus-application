/**
 * Created by michael on 07/05/16.
 */
var connection = require('../connection');

exports.create = function(user, done) {
    connection.get().query('INSERT INTO `users` SET ?', [user], function(error, result) {
        if(error) {
            return done(error);
        }

        //TODO: add auto-increment id in users table for result.insertId
        done(null, null);
    });
};

exports.deleteById = function(id, done) {
    connection.get().query('DELETE * FROM `users` WHERE `t_number` = ?', id, function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

exports.deleteByIds = function(ids, done) {
    connection.get().query('DELETE * FROM `users` WHERE `t_number` IN (?)', [ids], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

/*
    TODO: make export function for users update query
    UPDATE users ' +
    'INNER JOIN tokens ON users.t_number = tokens.t_number' +
    ' SET users.password = ?' +
    ' WHERE tokens.token = ?
 */
exports.update = function(joins, columns, conditions, values) {
    var queryParams = [];
    if(joins) {
        queryParams.push(joins.join(' '));
    }
    queryParams.push(columns, conditions);
    var query = connection.get().format(
                'UPDATE `users` ' + joins ? '? ' : '' +
                'SET ? ' +
                'WHERE ? ',
                queryParams);

    console.log(query);
    return;
    connection.get().query(query, [values], function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result.changedRows);
    });
};

exports.exists = function(username, done) {
    connection.get().query('SELECT `username` FROM `users` WHERE `username` = ?', username, function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getById = function(id, done) {
    connection.get().query('SELECT * FROM `users` WHERE `t_number` = ?', id, function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getByName = function(username, done) {
    connection.get().query('SELECT * FROM `users` WHERE `username` = ?', username, function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getAll = function(done) {
    connection.get().query('SELECT * FROM `users`', function(error, result) {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

