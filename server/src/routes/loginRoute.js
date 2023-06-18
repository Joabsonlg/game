const loginController = require('../controllers/loginController');

module.exports = (app) => {
    app.post('/login', loginController.login);
}