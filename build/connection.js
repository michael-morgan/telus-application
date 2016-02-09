/**
 * Created by Michael on 2/8/2016.
 */

var mysql = require('mysql'), async = require('async');

var state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'password',
        database: 'build_db'
    });
    done();
};

exports.get = function() {
    return state.pool;
};

exports.fixtures = function(data) {
    var pool = state.pool;
    if (!pool) {
        return done(new Error('Missing database connection'));
    }

    var names = Object.keys(data.tables);
    async.each(names, function(name, cb) {
        async.each(data.tables[name], function(row, cb) {
            var keys = Object.keys(row),
                values = keys.map(function(key) { return "'" + row[key] + "'" });

            pool.query('INSERT INTO ' + name + ' (' + keys.join(',') + ') VALUES (' + values.join(',') + ')', cb);
        }, cb);
    }, done);
};

exports.drop = function(tables, done) {
    var pool = state.pool;
    if (!pool) {
        return done(new Error('Missing database connection'));
    }

    async.each(tables, function(name, cb) {
        pool.query('DELETE * FROM ' + name, cb);
    }, done);
};