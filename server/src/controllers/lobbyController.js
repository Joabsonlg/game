const Lobby = require('../models/Lobby');
const lobby = new Lobby();

/**
 * Retrieves the lobby messages.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getLobbyMessages = (req, res, next) => {
  const lobbyMessages = lobby.getMessages();
  res.status(200).json(lobbyMessages);
};

/**
 * Adds a new message to the lobby.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const addLobbyMessage = (req, res, next) => {
  const { playerName, message } = req.body;
  const newMessage = { playerName, message };

  lobby.addMessage(newMessage);

  // Emit the new message to all connected clients
  io.emit('lobbyMessage', newMessage);

  res.status(201).json(newMessage);
};

/**
 * Retrieves the players in the lobby.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getLobbyPlayers = (req, res, next) => {
  const players = lobby.getPlayers();
  res.status(200).json(players);
};

/**
 * Adds a player to the lobby.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const addLobbyPlayer = (req, res, next) => {
  const { playerName } = req.body;

  const player = {
    id: generateUniqueId(), // Gere um ID único para o jogador
    name: playerName,
  };

  lobby.addPlayer(player);

  res.status(201).json(player);
};

/**
 * Removes a player from the lobby.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const removeLobbyPlayer = (req, res, next) => {
  const { playerId } = req.params;

  lobby.removePlayer(playerId);

  res.status(200).json({ message: 'Jogador deixou o lobby.' });
};

module.exports = {
  getLobbyMessages,
  addLobbyMessage,
  getLobbyPlayers,
  addLobbyPlayer,
  removeLobbyPlayer,
};
