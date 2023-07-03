import Phaser from 'phaser'
import {Player} from "../classes/Player.js";
import {socket} from "@/assets/js/socket";

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
        this.socket = socket;
    }

    create() {
        initMap(this);
        this.bombs = [];
    }

    update() {
        if (!this.players) return;

        const players = this.players.getChildren();

        players.forEach(player => player.update());
    }

    addPlayer(player, roomId) {
        if (!this.players) {
            this.players = this.physics.add.group();
        }

        const playerGame = new Player(this, player.x, player.y, 'player');
        playerGame.playerId = player.id;
        this.roomId = roomId;
        playerGame.roomId = roomId;
        playerGame.body.setCollideWorldBounds(true);
        this.physics.add.collider(this.players, this.wallsLayer);
        this.players.add(playerGame.setDepth(1), true);
    }
}

const initMap = (context) => {
    context.map = context.make.tilemap({key: 'bomb-field', tileWidth: 16, tileHeight: 16});
    context.tileset = context.map.addTilesetImage('bomb-field', 'tiles');
    context.groundLayer = context.map.createLayer('ground', context.tileset, 0, 0);
    context.wallsLayer = context.map.createLayer('walls', context.tileset, 0, 0);
    context.physics.world.setBounds(0, 0, context.map.widthInPixels, context.map.heightInPixels);

    context.wallsLayer.setCollisionByProperty({collides: true});
    showDebugWalls(context);
}

const showDebugWalls = (context) => {
    const debugGraphics = context.add.graphics().setAlpha(0.7);
    context.wallsLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    });
}

export const gameScene = new Game();