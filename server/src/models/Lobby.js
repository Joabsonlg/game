const Message = require('./Message');

/**
 * Represents a lobby.
 */
class Lobby {
    /**
     * Creates a new instance of Lobby.
     */
    constructor() {
      /**
       * The players in the lobby.
       * @type {Array}
       */
      this.players = [];
  
      /**
       * The messages in the lobby.
       * @type {Array}
       */
      this.messages = [];
    }
  
    /**
     * Adds a player to the lobby.
     * @param {Object} player - The player to add.
     */
    addPlayer(player) {
      this.players.push(player);
    }
  
    /**
     * Removes a player from the lobby.
     * @param {Object} player - The player to remove.
     */
    removePlayer(player) {
      const index = this.players.findIndex((p) => p.id === player.id);
      if (index !== -1) {
        this.players.splice(index, 1);
      }
    }
    
    /**
    * Checks if a player exists in the lobby.
    * @param {string} playerId - The ID of the player to check.
    * @returns {boolean} - True if the player exists, false otherwise.
    */
    hasPlayer(playerId) {
      return this.players.some((player) => player.id === playerId);
    }

    /**
     * Retrieves the players in the lobby.
     * @returns {Array} - The players in the lobby.
     */
    getPlayers() {
      return this.players;
    }
  
    /**
     * Retrieves the messages in the lobby.
     * @returns {Array} - The messages in the lobby.
     */
    getMessages() {
      return this.messages;
    }
  
    /**
    * Adds a message to the lobby.
    * @param {string} playerUsername - The username of the player who sent the message.
    * @param {string} content - The content of the message.
    */
    addMessage(playerUsername, content) {
      const message = new Message(playerUsername, content);
      this.messages.push(message);
    }

    /**
    * Clears the messages in the lobby.
    */
    clearMessages() {
      this.messages = [];
    }
  }
  
  module.exports = Lobby;
  