/**
 * Created by jacob on 08/06/16.
 */
var connection = require('../connection');
import * as utility from "../utility";

exports.create = (hours, done) => {
    connection.get().query('INSERT INTO `selling_hours_schedule` SET ?', [hours], (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.getAllHours = (id, done) => {
    connection.get().query('SELECT * FROM selling_hours_schedule INNER JOIN stores_util ON selling_hours_schedule.team_member = stores_util.t_number '+
    'WHERE selling_hours_schedule.store_id = stores_util.store_id ', id, (error, result) => {
        //'AND YEARWEEK(selling_hours_schedule.date, 0) = YEARWEEK(CURDATE(), 0)', id, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getHoursByDate = (id,weekDate, done) => {
    connection.get().query('SELECT * FROM selling_hours_schedule INNER JOIN stores_util ON selling_hours_schedule.team_member = stores_util.t_number '+
        'WHERE selling_hours_schedule.store_id = stores_util.store_id '+
        'AND YEARWEEK(selling_hours_schedule.date, 0) = YEARWEEK(?, 0)', weekDate, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.getHoursByStoreId = (id, done) => {
    connection.get().query('SELECT * FROM `selling_hours_schedule` WHERE store_id = ?', id, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};


exports.updateHoursByID = (values, done) => {
    connection.get().query('UPDATE selling_hours_schedule SET selling_hours = ? WHERE team_member = ? AND store_id = ? and date = ?', values, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result.changedRows);
    });
};

exports.deleteCurrentWeekHours = (aDate,done) => {
    connection.get().query('DELETE s.* FROM selling_hours_schedule s INNER JOIN stores_util ON s.team_member = stores_util.t_number '+
    'WHERE s.store_id = stores_util.store_id AND YEARWEEK(s.date, 0) = YEARWEEK(?, 0)',aDate,(error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result.affectedRows);
    });
};

exports.getBudgetsWithStore = (values, done) => {
    connection.get().query('SELECT * FROM budgets WHERE date = ? AND store_id = ?', values, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

exports.createBudgets = (budget, done) => {
    connection.get().query('INSERT INTO `budgets` SET ?', [budget], (error, result) => {
        if(error) {
            utility.log({type: 'error', message: error});
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.updateBudgets = (values, done) => {
    connection.get().query('UPDATE `budgets` SET CTs = ?, revenue = ?, aotm = ?, ls = ? WHERE date = ? AND store_id = ?', values, (error, result) => {
        if(error) {
            utility.log({type: 'error', message: error});
            return done(error);
        }

        done(null, result.changedRows);
    });
};

exports.getBudgets = (values, done) => {
    connection.get().query('SELECT * FROM budgets WHERE date = ?', values, (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result);
    });
};

