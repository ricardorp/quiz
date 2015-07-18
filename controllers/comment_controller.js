var models = require('../models/models.js');

// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
    res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

exports.create = function(req, res) {
    var comment = models.Comment.build({
        texto: req.body.comment.texto,
        QuizId: Number(req.params.quizId)
    });

    comment.validate().then(function(err) {
        if (err) {
            res.render('comments/new.ejs', {
                comment: comment,
                quizId: req.params.quizId,
                errors: err.errors
            });
        } else {
            comment.save().then(function() { // save: guarda en BD campo texpo de comment
                res.redirect('/quizes/' + req.params.quizId); // Redirección HTTP a la lista de preguntas
            });
        }
    }).catch(function(error) {next(error);});
};