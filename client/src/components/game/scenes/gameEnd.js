import Phaser from 'phaser';

export class GameEnd extends Phaser.Scene {
    constructor() {
        super('gameEnd');
    }

    create() {
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;

        const message = this.data.get('message');

        const endMessage = this.add.text(centerX, centerY, message, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 16,
                y: 8
            },
        }).setOrigin(0.5);
    }
}
