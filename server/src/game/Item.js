const {v4: UUIDv4} = require('uuid');

class Item {
    /**
     * Creates a new instance of an item.
     * @param {string} type - The item's type (e.g., "Vida", "Patins").
     * @param x
     * @param y
     * @param {string} sprite - The player's sprite.
     */
    constructor(type, x, y, sprite) {
        this.id = UUIDv4();
        this.type = type;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
    }

    /**
     * Apply the effect of the item to the player.
     * @param {Player} player - The player to apply the effect to.
     * @param io
     * @param roomId
     */
    applyEffect(player, io, roomId) {
        if (this.type === "life") {
            player.addLife();
        } else if (this.type === "speed") {
            player.setSpeed(2);
        }

        setTimeout(() => {
            this.removeEffect(player, io, roomId);
        }, 5000);
    }

    /**
     * Removes the effect of the item from the player.
     * @param {Player} player - The player to remove the effect from.
     * @param io
     * @param roomId
     */
    removeEffect(player, io, roomId) {
        if (this.type === "speed") {
            player.setSpeed(1);
            io.to(roomId).emit('playerUpdated', player);
        }
    }
}

module.exports = Item;
