export class Actor extends Phaser.Physics.Arcade.Sprite {
    const
    hp = 100;

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.getBody().setCollideWorldBounds(true);
    }

    getDamage(damage) {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            repeat: 3,
            yoyo: true,
            alpha: 0.5,
            onStart: () => {
                if (damage) {
                    this.hp = this.hp - damage;
                }
            },
            onComplete: () => {
                this.setAlpha(1);
            },
        });
    }

    getHPValue() {
        return this.hp;
    }

    move(x, y) {
        this.setVelocity(x, y);
    }

    getBody() {
        return this.body;
    }
}