// set env variable for test purposes
//TODO: remove environment variable on live
process.env.NODE_ENV = "development";

exports.log = function({type, message}) {
    if(process.env.NODE_ENV !== 'development') { return; }

    switch(type) {
        case 'log':
            console.log(message);
            break;
        case 'error':
            console.error(message);
            break;
        case 'debug':
            console.debug(message);
    }
};

exports.check = function(expression, message) {
    if(process.env.NODE_ENV !== 'development') { return; }

    console.log('Result: ' + expression + ' Value: ' + message);
};