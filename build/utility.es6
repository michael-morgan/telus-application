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
            break;
        default:
            break;
    }
};

exports.check = function(expression, message) {
    if(process.env.NODE_ENV !== 'development') { return; }

    console.log('Result: ' + expression + ' Value: ' + message);
};

exports.currentDate = function() {
	let date = new Date();
	let format = function(value) { return value < 10 ? "0" : ""; };

	let hour = date.getHours();
	hour = format(hour) + hour;

	let min = date.getMinutes();
	min = format(min) + min;

	let sec = date.getSeconds();
	sec = format(sec) + sec;

	let year = date.getFullYear();

	let month = date.getMonth() + 1;
	month = format(month) + month;

	let day = date.getDate();
	day = format(day) + day;

	return `${year}:${month}:${day} ${hour}:${min}:${sec}`;
};