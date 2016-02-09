/**
 * Created by Michael on 2/8/2016.
 */
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'password',
    database: 'build_db'
});

module.exports = connection;