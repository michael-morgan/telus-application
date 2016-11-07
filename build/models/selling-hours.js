'use strict';

var _utility = require('../utility');

var utility = _interopRequireWildcard(_utility);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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

exports.getAllHours = function (id, done) {
    connection.get().query('SELECT * FROM selling_hours_schedule INNER JOIN stores_util ON selling_hours_schedule.team_member = stores_util.t_number ' + 'WHERE selling_hours_schedule.store_id = stores_util.store_id ', id, function (error, result) {
        //'AND YEARWEEK(selling_hours_schedule.date, 0) = YEARWEEK(CURDATE(), 0)', id, (error, result) => {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getHoursByDate = function (id, weekDate, done) {
    connection.get().query('SELECT * FROM selling_hours_schedule INNER JOIN stores_util ON selling_hours_schedule.team_member = stores_util.t_number ' + 'WHERE selling_hours_schedule.store_id = stores_util.store_id ' + 'AND YEARWEEK(selling_hours_schedule.date, 0) = YEARWEEK(?, 0)', weekDate, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getHoursByStoreId = function (id, done) {
    connection.get().query('SELECT * FROM `selling_hours_schedule` WHERE store_id = ?', id, function (error, result) {
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

exports.deleteCurrentWeekHours = function (aDate, done) {
    connection.get().query('DELETE s.* FROM selling_hours_schedule s INNER JOIN stores_util ON s.team_member = stores_util.t_number ' + 'WHERE s.store_id = stores_util.store_id AND YEARWEEK(s.date, 0) = YEARWEEK(?, 0)', aDate, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

exports.getBudgetsWithStore = function (values, done) {
    connection.get().query('SELECT * FROM budgets WHERE date = ? AND store_id = ?', values, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.getStoreBudget = function (values, done) {
    connection.get().query('SELECT * FROM budgets WHERE store_id = ?', values, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.createBudgets = function (budget, done) {
    connection.get().query('INSERT INTO `budgets` SET ?', [budget], function (error, result) {
        if (error) {
            utility.log({ type: 'error', message: error });
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.updateBudgets = function (values, done) {
    connection.get().query('UPDATE `budgets` SET CTs = ?, revenue = ?, aotm = ?, ls = ? WHERE date = ? AND store_id = ?', values, function (error, result) {
        if (error) {
            utility.log({ type: 'error', message: error });
            return done(error);
        }

        done(null, result.changedRows);
    });
};

exports.getBudgets = function (values, done) {
    connection.get().query('SELECT * FROM budgets WHERE date = ?', values, function (error, result) {
        if (error) {
            return done(error);
        }

        done(null, result);
    });
};

//# sourceMappingURL=selling-hours.js.map