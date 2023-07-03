/**
 * Represents a player in the Bomberman game.
 * @class
 */
class Player {
    /**
     * Creates a new instance of Player.
     * @param {string} id - The player's id.
     * @param {string} sprite - The player's sprite.
     */
    constructor(id, sprite) {
        this.id = id;
        this.sprite = sprite;
        this.position = {x: 30, y: 30};
        this.lives = 3;
        this.score = 0;
        this.alive = true;
        this.timeOfLastBomb = new Date();
        this.direction = 'down';
    }

    /**
     * Add points to the player's score.
     */
    addPoints(points) {
        this.score += points;
    }

    /**
     * Remove a life from the player.
     */
    removeLife() {
        this.lives--;
        if (this.lives === 0) this.alive = false;
    }

    /**
     * Set the socket.io instance.
     */
    setSocketIO(socket) {
        this.socket = socket;
    }

    /**
     * Set the player's position.
     */
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }

    /**
     * Get the player's position.
     */
    getPosition() {
        return this.position;
    }
}

module.exports = Player;