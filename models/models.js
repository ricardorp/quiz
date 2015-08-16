var path = require('path');
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo  ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(DB_name, user, pwd, {
    dialect: dialect,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // solo SQLite (.env)
    omitNull: true // solo Postgres
});

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; // Exportar definición de la tabla Quiz
exports.Comment = Comment; // Exportar definición de la tabla Comment

exports.findStatistics = function (callback) {
    var numPreguntas = 0,
        numComentarios = 0,
        numPreguntasSinComentarios = 0,
        numPreguntasConComentarios = 0,
        i = 0,
        media = 0;
    sequelize.query(
        "select q.id, count(c.id) comentarios from Quizzes q left join Comments c on c.QuizId = q.id group by q.id",
        {type: sequelize.QueryTypes.SELECT}
    ).success(function (preguntas) {
            numPreguntas = preguntas.length;
            for(i = 0; i < preguntas.length; i++) {
                numComentarios += preguntas[i].comentarios;
                if (preguntas[i].comentarios == 0) {
                    numPreguntasSinComentarios++;
                } else {
                    numPreguntasConComentarios++;
                }
            }
            media = (numPreguntas != 0 ? numComentarios / numPreguntas : 0).toFixed(2);
            callback({
                numeroPreguntas: numPreguntas,
                numeroComentarios: numComentarios,
                mediaComentariosPregunta : media,
                numeroPreguntasSinComentarios: numPreguntasSinComentarios,
                numeroPreguntasConComentarios: numPreguntasConComentarios
            });
        });
};

// sequelize.sync() crea e inicializa tabla de preguntas BD
sequelize.sync().success(function () {
    // success(..) ejecuta el manejador una vez creada la tabla
    Quiz.count().success(function (count) {
        if (count === 0) {
            Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma', tema: 'otro'});
            Quiz.create({pregunta: 'Capital de Portugal', respuesta: 'Lisboa', tema: 'otro'}).then(function () {
                console.log('Base de datos inicializada.');
            });
        }
    });
});

