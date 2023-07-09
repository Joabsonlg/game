import {Actor} from "./Actor.js";
import {Bomb} from "./Bomb.js";

export class Player extends Actor {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 110;

        this.movementMap = {
            left: {x: -this.speed, y: 0, animation: 'left'},
            right: {x: this.speed, y: 0, animation: 'right'},
            up: {x: 0, y: -this.speed, animation: 'up'},
            down: {x: 0, y: this.speed, animation: 'down'}
        };

        this.bombDelay = 2000;
        this.initAnimations();
    }

    update() {
        this.setVelocity(0)
        const getMovement = () => {
            if (this.scene.socket.playerId !== this.playerId) return {x: 0, y: 0};
            for (const direction in this.movementMap) {
                if (this.scene.input.keyboard.createCursorKeys()[direction].isDown) {
                    return this.movementMap[direction];
                }
            }
            return {x: 0, y: 0};
        };
        const movement = getMovement();
        const animationKey = movement.animation || 'idle';
        this.anims.play(animationKey, true);
        if (movement.x !== 0 || movement.y !== 0) {
            this.move(movement.x, movement.y);
            this.scene.socket.emit('playerMove', {
                roomId: this.scene.roomId,
                direction: animationKey,
                position: {x: this.x, y: this.y}
            });
        } else {
            this.anims.stop();
        }

        if (this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).isDown && Date.now() - (this.lastBombTime || 0) > this.bombDelay) {
            this.lastBombTime = Date.now();
            const bomb = new Bomb(this.scene, this.x, this.y, 'bomb');
        }
    }


    initAnimations() {
        this.scene.anims.create({
            key: 'left',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'left0',
                end: 6
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: 'right',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'right0',
                end: 6
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'up0',
                end: 6
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'down0',
                end: 6
            }),
            frameRate: 8,
        });
        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('player', {
                prefix: 'idle0',
                end: 0
            }),
            frameRate: 8,
        });
    }

    definePosition(x, y) {
        this.setPosition(x, y);
    }
}