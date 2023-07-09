const {v4: UUIDv4} = require('uuid');

/**
 * Represents a bomb in the game.
 * @class
 */
class Bomb {
    /**
     * Creates a new instance of a bomb.
     */
    constructor(x, y) {
        this.id = UUIDv4();
        this.x = x;
        this.y = y;
        this.timer = 3;
    }
}

module.exports = Bomb;
