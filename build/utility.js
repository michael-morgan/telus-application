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

//# sourceMappingURL=utility.js.map