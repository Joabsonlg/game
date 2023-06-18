/**
 * Represents a player.
 * @class
 */
class Player {
    /**
     * Creates a new instance of Player.
     * @param {string} email - The player's email.
     * @param {string} password - The player's password.
     * @param {string} username - The player's username.
     */
    constructor(email, password, username) {
        this.email = email;
        this.password = password;
        this.username = username;
    }
}

module.exports = Player;