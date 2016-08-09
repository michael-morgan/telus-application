'use strict';

/**
 * Created by jacob on 08/06/16.
 */
var connection = require('../connection');

exports.create = function (hours, done) {
    connection.get().query('INSERT INTO `selling_hours_schedule` SET ?', [hours], function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.getHoursByStoreIDForCurrentWeek = function (id, done) {
    connection.get().query('SELECT * FROM selling_hours_schedule INNER JOIN stores_util ON selling_hours_schedule.team_member = stores_util.t_number ' + 'WHERE selling_hours_schedule.store_id = stores_util.store_id AND selling_hours_schedule.store_id = ? ' + 'AND YEARWEEK(selling_hours_schedule.date, 0) = YEARWEEK(CURDATE(), 0)', id, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.updateHoursByID = function (values, done) {
    connection.get().query('UPDATE selling_hours_schedule SET selling_hours = ? WHERE team_member = ? AND store_id = ? and date = ?', values, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.changedRows);
    });
};

exports.getBudgets = function (values, done) {
    connection.get().query('SELECT * FROM budgets WHERE date = ? AND store_id = ?', values, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.createBudgets = function (budget, done) {
    connection.get().query('INSERT INTO `budgets` SET ?', [budget], function (error, result) {
        if (error) {
            console.log(error);
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.updateBudgets = function (values, done) {
    connection.get().query('UPDATE `budgets` SET CTs = ?, revenue = ?, aotm = ?, ls = ? WHERE date = ? AND store_id = ?', values, function (error, result) {
        if (error) {
            console.log(error);
            return done(error);
        }

        done(null, result.changedRows);
    });
};

exports.getCTs = function (values, done) {
    connection.get().query('SELECT CTs FROM budgets WHERE date = ? AND store_id = ?', values, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

//# sourceMappingURL=selling-hours.js.map