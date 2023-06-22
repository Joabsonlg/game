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
     * @param {Object} message - The message to add.
     */
    addMessage(message) {
      this.messages.push(message);
    }
  }
  
  module.exports = Lobby;
  