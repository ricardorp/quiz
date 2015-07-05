var author = 'Ricardo Rodríguez',
    title = 'Quiz';

// GET /quizes/question
exports.question = function(req, res) {
    res.render('quizes/question', {
        title: title,
        pregunta: 'Capital de Italia'
    });
}

// GET /quizes/answer
exports.answer = function(req, res) {
    if (req.query.respuesta === 'Roma') {
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
}

// GET /author
exports.author = function(req, res) {
    res.render('author', {author : author});
}