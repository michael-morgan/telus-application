var compression = require('compression');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var expressValidator = require('express-validator');
var expressMessages = require('express-messages');
var connection = require('./connection');
var utility = require("./utility");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var nodemailer = require('nodemailer');
var randtoken = require('rand-token');
var bcrypt = require('bcryptjs');
var async = require('async');

// babel polyfill
require("babel-polyfill");

var index = require('./routes/index');
var users = require('./routes/users');
var observations = require('./routes/users/observations');
var behaviours = require('./routes/users/behaviours');
var binder = require('./routes/users/binder');
var transactions = require('./routes/users/transactions');
var sellingHours = require('./routes/users/selling-hours');
var wmp = require('./routes/users/wmp');

var app = express();

// use mysql connection
connection.connect(function(err) {
	if (err) {
		utility.log({ type: 'log', message: 'Unable to connect to MySQL' });
		process.exit(1);
	}
	else {
		utility.log({ type: 'log', message: 'Database connection established' });
	}
});

var sessionStore = new MySQLStore(connection.options, connection.get());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// set application to use gzip compression
app.use(compression());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'telus_build',
	store: sessionStore,
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

passport.serializeUser(function(user, done) {
    done(null, user.t_number);
});

passport.deserializeUser(function(t_number, done) {
    connection.get().query('SELECT * FROM users WHERE t_number = ?', [t_number], function(err, rows) {
        done(err, rows[0]);
    });
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        connection.get().query('SELECT * FROM users WHERE username = ?', [username.toLowerCase()], function(err, rows) {
            if(err) {
                throw done(err);
            }
            if(!rows[0]) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if(!bcrypt.compareSync(password, rows[0].password)) {
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(null, rows[0]);
        });
    }
));

app.use(function (req, res, next) {
    res.locals.messages = expressMessages(req, res);
    next();
});

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.post('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/users', users);
app.use('/users/observations', observations);
app.use('/users/behaviours', behaviours);
app.use('/users/binder', binder);
app.use('/users/transactions', transactions);
app.use('/users/selling-hours', sellingHours);
app.use('/users/wmp', wmp);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if(process.env.NODE_ENV === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
else {
    // production error handler
    // no stack traces leaked to user
    app.use(function(err, req, res, next) {
        if(req.user) {
            return res.redirect('/users/');
        }
        else {
            return res.redirect('/');
        }

        /*
         res.status(err.status || 500);
         res.render('error', {
         message: err.message,
         error: {}
         });
         */
    });
}

module.exports = app;