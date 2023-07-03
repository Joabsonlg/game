const playerRoute = require('./playerRoute');
const loginRoute = require('./loginRoute');
const lobbyRoute = require('./lobbyRoute');

module.exports = (app) => {
    playerRoute(app)
    loginRoute(app)
    lobbyRoute(app)
}