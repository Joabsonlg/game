import Phaser from 'phaser'

export class Boot extends Phaser.Scene {
    constructor() {
        super('splash');
    }

    preload() {
        this.load.baseURL = '/src/assets/game/';

        this.load.image('logo', 'logo.svg');
        this.load.image('background', 'back1.png');
        this.load.atlas('bomb', 'bomba.png', 'bomba_atlas.json');
        this.load.atlas('player', 'bomb.png', 'bomb_atlas.json');
        this.load.image({
            key: 'tiles',
            url: 'tilemaps/tiles.png',
        });
        this.load.tilemapTiledJSON('bomb-field', 'tilemaps/field2.json');
    }

    create() {
        this.background = this.add.image(0, 0, 'background');
        this.background.setOrigin(0, 0);
        this.background.displayWidth = this.game.config.width;
        this.background.displayHeight = this.game.config.height;

        this.add.image(this.game.config.width / 2, this.game.config.height / 2 - 25, 'logo');
        this.add.text(this.game.config.width / 2, this.game.config.height / 2 + 25, 'Loading game...').setOrigin(0.5);
        setTimeout(() => {
            this.scene.start('preGame');
        }, 1000);
    }
}