'use strict';

// set env variable for test purposes
//TODO: remove environment variable on live
process.env.NODE_ENV = "development";

exports.log = function (_ref) {
    var type = _ref.type;
    var message = _ref.message;

    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    switch (type) {
        case 'log':
            console.log(message);
            break;
        case 'error':
            console.error(message);
            break;
        case 'debug':
            console.debug(message);
            break;
        default:
            break;
    }
};

exports.check = function (expression, message) {
    if (process.env.NODE_ENV !== 'development') {
        return;
    }

    console.log('Result: ' + expression + ' Value: ' + message);
};

exports.currentDate = function () {
    var date = new Date();
    var format = function format(value) {
        return value < 10 ? "0" : "";
    };

    var hour = date.getHours();
    hour = format(hour) + hour;

    var min = date.getMinutes();
    min = format(min) + min;

    var sec = date.getSeconds();
    sec = format(sec) + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = format(month) + month;

    var day = date.getDate();
    day = format(day) + day;

    return year + ':' + month + ':' + day + ' ' + hour + ':' + min + ':' + sec;
};

//# sourceMappingURL=utility.js.map
