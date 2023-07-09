import Phaser from 'phaser';

export class GameEnd extends Phaser.Scene {
    constructor() {
        super('gameEnd');
    }

    create() {
        const centerX = this.game.config.width / 2;
        const centerY = this.game.config.height / 2;

        const message = this.scene.settings.data.message;
        console.log(message);

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

        // adicionar botão para redicionar o usuário para a tela inicial
        const button = this.add.text(centerX, centerY + 55, 'Voltar para o lobby', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
                x: 16,
                y: 8
            },
        }).setOrigin(0.5).setInteractive();

        button.on('pointerdown', () => {
            window.location.href = '/lobby';
        });
    }

    update() {

    }
}
