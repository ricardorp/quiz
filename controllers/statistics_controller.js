var models = require('../models/models.js');

// Recupera las estadísticas
exports.show = function (req, res) {
    var estadisticas = models.findStatistics(function (estadisticas) {
        res.render('statistics/statistics', {estadisticas: estadisticas, errors: []});
    });
};
