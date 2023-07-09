import {Actor} from "./Actor.js";
import {Bomb} from "./Bomb.js";
import {uiScene} from "@/components/game/scenes/ui/UI";

export class Player extends Actor {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.sprite = texture;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 40;
        this.baseSpeed = 40;
        this.setScale(0.4)

        this.movementMap = {
            left: {x: -this.speed, y: 0, animation: 'left'},
            right: {x: this.speed, y: 0, animation: 'right'},
            up: {x: 0, y: -this.speed, animation: 'up'},
            down: {x: 0, y: this.speed, animation: 'down'}
        };

        this.bombDelay = 2000;
        this.initAnimations(texture);
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
        this.anims.play(this.sprite + animationKey, true);

        if (animationKey === 'left') this.setFlipX(true);
        else if (animationKey === 'right') this.setFlipX(false);

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
            this.scene.socket.emit('bombPlaced', {
                roomId: this.scene.roomId,
                position: {x: this.x, y: this.y}
            });
        }
    }

    updatePlayer(player) {
        this.lives = player.lives;
        this.score = player.score;
        this.speed = this.baseSpeed * player.speed;
        this.updateMovementMap();
        if (this.scene.socket.playerId !== this.playerId) return;
        uiScene.setLife(this.lives);
    }

    initAnimations(texture) {
        this.scene.anims.create({
            key: texture + 'left',
            frames: this.scene.anims.generateFrameNames(texture, {
                prefix: 'right00',
                end: 7
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: texture + 'right',
            frames: this.scene.anims.generateFrameNames(texture, {
                prefix: 'right00',
                end: 7
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: texture + 'up',
            frames: this.scene.anims.generateFrameNames(texture, {
                prefix: 'up00',
                end: 7
            }),
            frameRate: 8
        });
        this.scene.anims.create({
            key: texture + 'down',
            frames: this.scene.anims.generateFrameNames(texture, {
                prefix: 'down00',
                end: 7
            }),
            frameRate: 8,
        });
        this.scene.anims.create({
            key: texture + 'idle',
            frames: this.scene.anims.generateFrameNames(texture, {
                prefix: 'idle00',
                end: 0
            }),
            frameRate: 8,
        });
    }

    updateMovementMap() {
        this.movementMap = {
            left: {x: -this.speed, y: 0, animation: 'left'},
            right: {x: this.speed, y: 0, animation: 'right'},
            up: {x: 0, y: -this.speed, animation: 'up'},
            down: {x: 0, y: this.speed, animation: 'down'}
        };
    }

    definePosition(x, y) {
        this.setPosition(x, y);
    }
}