export class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initAnimations();
        this.body.setImmovable(true);
    }

    update() {
    }

    collect() {
        this.destroy();
    }

    initAnimations() {
    }
}
