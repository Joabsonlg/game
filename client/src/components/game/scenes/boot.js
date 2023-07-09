import Phaser from 'phaser'
import {gameScene} from "@/components/game/scenes/game";
import {useGameStore} from "@/stores/game";

const gameStore = useGameStore();

export class Boot extends Phaser.Scene {
    constructor() {
        super('splash');
    }

    preload() {
        this.load.baseURL = '/src/assets/game/';

        this.load.image('logo', 'logo.svg');
        this.load.image('background', 'back2.png');
        this.load.atlas('bomb', 'bomba.png', 'bomba_atlas.json');
        this.load.atlas('player', 'player1.png', 'player1_atlas.json');
        this.load.atlas('player2', 'player2.png', 'player2_atlas.json');
        this.load.atlas('player3', 'player3.png', 'player3_atlas.json');
        this.load.atlas('player4', 'player4.png', 'player4_atlas.json');
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
            const players = gameStore.gameState.players;
            players.forEach((player) => {
                gameScene.addPlayer(player);
            });

            this.scene.start('game');
            this.scene.start('ui-scene');
        }, 2000);
    }
}