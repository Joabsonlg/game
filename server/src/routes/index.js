const playerRoute = require('./playerRoute');
const loginRoute = require('./loginRoute');

module.exports = (app) => {
    playerRoute(app)
    loginRoute(app)
}