'use strict';

/*
 Query result helpers:
 result.insertId -> auto incremented primary key from insert
 result.affectedRows -> number of affected rows from update/delete statement
 result.changedRows -> number of changed rows from update statement
 */

var mysql = require('mysql'),
    async = require('async');

var state = {
    pool: null
};

exports.connect = function (done) {
    state.pool = mysql.createPool({
        host: process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',
        port: process.env.OPENSHIFT_MYSQL_DB_PORT || '3306',
        user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',
        password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || 'password',
        database: 'build_db',
        multipleStatements: true
    });
    done();
};

exports.get = function () {
    return state.pool;
};

exports.fixtures = function (data) {
    var pool = state.pool;
    if (!pool) {
        return done(new Error('Missing database connection'));
    }

    var names = Object.keys(data.tables);
    async.each(names, function (name, cb) {
        async.each(data.tables[name], function (row, cb) {
            var keys = Object.keys(row),
                values = keys.map(function (key) {
                return "'" + row[key] + "'";
            });

            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
        }, cb);
    }, done);
};

exports.drop = function (tables, done) {
    var pool = state.pool;
    if (!pool) {
        return done(new Error('Missing database connection'));
    }

    async.each(tables, function (name, cb) {
        pool.query('DELETE * FROM ' + name, cb);
    }, done);
};

//# sourceMappingURL=connection.js.map