class Item {
    /**
     * Creates a new instance of an item.
     * @param {string} type - The item's type (e.g., "Vida", "Patins").
     * @param {string} sprite - The player's sprite.
     */
    constructor(type, x, y) {
        this.id = UUIDv4();
        this.type = type;
        this.sprite = sprite;
        this.x = x;
        this.y = y;
    }

    /**
     * Apply the effect of the item to the player.
     * @param {Player} player - The player to apply the effect to.
     */
    applyEffect(player) {
        if (this.type === "Vida") {
            player.addLife();
        } else if (this.type === "Patins") {
            player.increaseSpeed();
        } else if (this.type === "Fogo"){
            player.increaseFireRange();
        }
    }
}

module.exports = Item;
