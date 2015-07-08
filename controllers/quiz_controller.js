var author = 'Ricardo Rodríguez',
    title = 'Quiz'
    models = require('../models/models.js');

// GET /quizes/question
exports.question = function(req, res) {
    models.Quiz.findAll().success(function(quiz){
        res.render('quizes/question', {
            title: title,
            pregunta: quiz[0].pregunta
        });
    });
}

// GET /quizes/answer
exports.answer = function (req, res) {
    models.Quiz.findAll().success(function (quiz) {
        if (req.query.respuesta === quiz[0].respuesta) {
            res.render('quizes/answer', {
                title: title,
                respuesta: 'Correcto'
            });
        } else {
            res.render('quizes/answer', {
                title: 'Quiz',
                respuesta: 'Incorrecto'
            });
        }
    });
}

// GET /author
exports.author = function(req, res) {
    res.render('author', {author : author});
}