const playerController = require('../controllers/playerController');
const loginController = require('../controllers/loginController');

module.exports = (app) => {
    app.post('/player', playerController.registerPlayer);
    app.get('/player', loginController.verifyToken, playerController.getPlayers);
}