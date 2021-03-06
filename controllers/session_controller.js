// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};

// GET /login   -- Formulario de login
exports.new = function (req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login  -- Crear la sesión
exports.create = function (req, res) {
    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function (error, user) {
        if (error) { // En caso de error, devolvemos los errores a la página de login
            req.session.errors = [{'message': 'Se ha producido un error: ' + error}];
            res.redirect('/login');
            return;
        }

        // Crear req.session.uer y guardar campos id y username
        // La sesión se define por la existencia de: req.session.user
        req.session.user = {id: user.id, username: user.username};
        // Marcamos la primera vez que se utilizó la sesión
        req.session.lastUsed = (new Date()).getTime();
        res.redirect(req.session.redir.toString()); // redirect al path anterior al login
    });
};

// DELETE /logout   -- Destruir la sesión
exports.destroy = function (req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString()); // redirect al path anterior al login
};