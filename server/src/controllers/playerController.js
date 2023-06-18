const Player = require('../models/Player');
const db = require('../config/db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

/**
 * Registers a new player.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const registerPlayer = async (req, res, next) => {
    const {email, password, username} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const player = new Player(email, hashedPassword, username);

        const query = `INSERT INTO players (email, password, username)
                       VALUES ($1, $2, $3) RETURNING *`;
        const values = [player.email, player.password, player.username];

        await db.query(query, values);

        res.status(201).json(player);
    } catch (err) {
        res.status(500).json({error: err});
    }
};

/**
 * Gets all players.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getPlayers = async (req, res, next) => {
    const query = `SELECT *
                   FROM players`;
    try {
        const players = await db.query(query);
        res.status(200).json(players.rows);
    } catch (err) {
        res.status(500).json({error: err});
    }
}

module.exports = {
    registerPlayer,
    getPlayers
}