var author = 'Ricardo Rodríguez',
    title = 'Quiz',
    models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res, next, quizId) {
    models.Quiz.find(quizId).then(
        function (quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe quizId=' + quizId));
            }
        }
    ).catch(function (error) {
            next(error);
        }
    );
};

// GET /quizes
exports.index = function (req, res) {
    var search = _procesarSearch(req.query.search),
        whereSection = search ? {where: ["upper(pregunta) like ?", search]} : {};

    models.Quiz.findAll(whereSection).then(
        function (quizes) {
            res.render('quizes/index.ejs', {quizes: quizes});
        }
    ).catch(function (error) {
            next(error);
        });
};

// GET /quizes/:id
exports.show = function (req, res) {
    res.render('quizes/show', {
        title: title,
        quiz: req.quiz
    });
};

// GET /quizes/:id/answer
exports.answer = function (req, res) {
    var resultado = 'Incorrecto';
    if (req.query.respuesta === req.quiz.respuesta) {
        resultado = 'Correcto';
    }
    res.render('quizes/answer', {
        title: title,
        quiz: req.quiz,
        respuesta: resultado
    });
};

// GET /author
exports.author = function (req, res) {
    res.render('author', {author: author});
};

/**
 * Procesa una query de búsqueda para transformarla en una query SQL. Si la query no existe o está vacía, devuelve null.
 * @param query Query de búsqueda compuesta por una o más palabras.
 * @returns {String} Si la query no existe o está vacía devuelve null, en otro caso, devuelve cada palabra pasada a
 * mayúsculas y separada por un %. Ejemplo Capital Italia se convertiría en %CAPITAL%ITALIA%
 * @private
 */
_procesarSearch = function (query) {
    if (query) {
        return query.trim().replace(/(\w+)/g, '%$1%').replace(/\s+/g, '').replace(/%+/g, '%').toUpperCase()
    }
    return null;
};