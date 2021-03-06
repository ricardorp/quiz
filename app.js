// Tiempo máximo de inactividad antes de cerrar la sesión del usuario.
var sessionMaxIdleTime = 1000*60*2; // milliseconds * seconds * minutes

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var methodOverride = require('method-override');
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function(req, res, next) {
    var user = req.session.user,
        lastUsed = new Number(req.session.lastUsed),
        ahora = (new Date()).getTime();
    // guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;

        // Gestión de auto logout
        if (user) {
            if (lastUsed && (ahora - lastUsed) < sessionMaxIdleTime) {
                lastUsed = ahora;
            } else {
                delete req.session.user;
                console.log('Sesión para el usuario ' + user.username + ', cerrada.');
            }
        }
    }

    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
