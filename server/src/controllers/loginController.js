const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

/**
 * Authenticates a player.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const query = 'SELECT * FROM players WHERE email = $1';
        const result = await db.query(query, [email]);
        const player = result.rows[0];

        if (!player || !(await bcrypt.compare(password, player.password))) {
            return res.status(401).json({error: 'Invalid email or password'});
        }

        const token = jwt.sign({playerId: player.id}, 'secret_key');

        res.status(200).json({message: 'Authentication successful', token});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

/**
 * Verifies the authenticity of a token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({error: 'Token not provided'});
    }

    jwt.verify(token, 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({error: 'Invalid token'});
        }
        next();
    });
};

/**
 * Gets a player by token.
 */
const getPlayerByToken = async (token) => {
    try {
        const decoded = jwt.verify(token, 'secret_key');
        const query = 'SELECT * FROM players WHERE id = $1';
        const result = await db.query(query, [decoded.playerId]);
        return result.rows[0];
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    login,
    verifyToken,
    getPlayerByToken
}