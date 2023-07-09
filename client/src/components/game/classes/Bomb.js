export class Bomb extends Phaser.Physics.Arcade.Sprite {
    const
    damage = 100;

    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initAnimations();
        this.anims.play('burn', true);
        this.timer = this.scene.time.addEvent({
            delay: 3000,
            callback: this.explode,
            callbackScope: this,
            loop: false,
        });
        this.body.setImmovable(true);
    }

    update() {
    }

    calculateDamage(x, y) {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
        return Math.round(this.damage / distance);
    }

    explode() {
        this.anims.play('explosion', true);
        this.scene.tweens.add({
            targets: this,
            duration: 1000,
            scale: 0,
            onComplete: () => {
                this.destroy();
            },
        });

        // this.scene.physics.add.overlap(this, this.scene.player, (bomb, player) => {
        //     player.takeDamage(this.calculateDamage(player.x, player.y));
        //     bomb.destroy();
        // });
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