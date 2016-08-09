/**
 * Created by jacob on 08/06/16.
 */
var connection = require('../connection');

exports.create = (hours, done) => {
    connection.get().query('INSERT INTO `selling_hours_schedule` SET ?', [hours], (error, result) => {
        if(error) {
            return done(error);
        }

        done(null, result.insertId);
    });
};

exports.getHoursByStoreIDForCurrentWeek = (id,done) => {
    connection.get().query('SELECT * FROM selling_hours_schedule INNER JOIN stores_util ON selling_hours_schedule.team_member = stores_util.t_number '+
    'WHERE selling_hours_schedule.store_id = stores_util.store_id AND selling_hours_schedule.store_id = ? '+
        'AND YEARWEEK(selling_hours_schedule.date, 0) = YEARWEEK(CURDATE(), 0)',id, (error, result) => {
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