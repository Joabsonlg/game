const lobbyController = require('../controllers/lobbyController');


module.exports = (app) => {
    app.get('/lobby', lobbyController.getLobbyMessages);
    app.post('/lobby', lobbyController.addLobbyMessage);
}