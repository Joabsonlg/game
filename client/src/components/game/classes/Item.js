export class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, sprite);
        this.sprite = sprite;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initAnimations();
        this.body.setImmovable(true);
        this.setScale(0.15)
        this.height = 16;
        this.width = 16;
    }

    update() {
    }

    initAnimations() {
    }
}

const showDebugItem = (item) => {
    const debugGraphics = item.scene.add.graphics().setAlpha(0.7);
    item.body.debugGraphic = debugGraphics;
    item.scene.physics.world.debugGraphic = debugGraphics;

    item.scene.physics.world.createDebugGraphic();
}
