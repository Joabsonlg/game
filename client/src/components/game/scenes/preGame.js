import Phaser from 'phaser'

export class PreGame extends Phaser.Scene {
    constructor() {
        super('preGame');
    }

    create() {
        this.background = this.add.image(0, 0, 'background');
        this.background.setOrigin(0, 0);
        this.background.displayWidth = this.game.config.width;
        this.background.displayHeight = this.game.config.height;

        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;

        const startButton = this.add.text(centerX, centerY + 100, 'Iniciar o Jogo', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 16,
                y: 8
            },
        }).setOrigin(0.5).setInteractive();

        startButton.on('pointerover', () => {
            this.game.canvas.style.cursor = 'pointer';
        });

        startButton.on('pointerout', () => {
            this.game.canvas.style.cursor = 'default';
        });

        startButton.on('pointerup', () => {
            this.scene.start('game');
            this.scene.start('ui-scene');
        });
    }
}