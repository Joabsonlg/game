/**
 * Represents a message.
 * @class
 */
class Message {
    /**
     * Creates a new instance of Message.
     * @param {string} playerUsername - The username of the player who send the message.
     * @param {string} content - The content of the message.
     */
    constructor(playerUsername, content) {
        this.playerUsername = playerUsername
        this.content = content
    }
}

module.exports = Message;