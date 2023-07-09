export class Bomb extends Phaser.Physics.Arcade.Sprite {
    damage = 100;

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initAnimations();
        this.anims.play('burn', true);
        this.body.setImmovable(true);
        this.setScale(0.4)
    }

    update() {
    }

    calculateDamage(x, y) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
        return Math.round(this.damage / distance);
    }

    explode() {
        this.anims.play('explosion', true);

        // Desenhar um círculo de explosão
        const circle = new Phaser.Geom.Circle(this.x, this.y, 30);
        const graphics = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } });
        graphics.fillCircleShape(circle);
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                graphics.destroy();
            }
        });

        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            scale: 0,
            onComplete: () => {
                this.destroy();
            },
        });
    }

    initAnimations() {
        if (!this.scene.anims.get('burn')) {
            this.scene.anims.create({
                key: 'burn',
                frames: this.scene.anims.generateFrameNames('bomb', {
                    prefix: 'tile',
                    end: 4,
                }),
                frameRate: 8,
                repeat: -1,
            });

            this.scene.anims.create({
                key: 'explosion',
                frames: this.scene.anims.generateFrameNames('bomb', {
                    prefix: 'tile',
                    start: 5,
                }),
                frameRate: 8,
            });
        }
    }
}