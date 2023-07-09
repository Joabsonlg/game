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

        this.physics.add.collider(this.players, this.wallsLayer, (player, wall) => {
            console.log('colidiu cacete do caralho');
        });
    }

    update() {
        if (!this.players) return;

        const players = this.players.getChildren();

        players.forEach((player) => {
            player.update();
            // showDebugPlayer(player);
        });
    }

    addPlayer(player) {
        if (!this.players) {
            this.players = this.add.group();
        }

        const playerGame = new Player(this, player.position.x, player.position.y, 'player');
        playerGame.playerId = player.id;
        this.players.add(playerGame.setDepth(1), true);
    }

    findPlayerSpriteById(playerId) {
        return this.players.getChildren().find(sprite => sprite.playerId === playerId);
    }

    movePlayer(player) {
        const playerGame = this.findPlayerSpriteById(player.id);

        console.log(`Moving player: ${player.id}, params: ${player.position.x}, ${player.position.y}`);
        console.log(player.id, this.socket.playerId);
        if (player.id === this.socket.playerId) return;

        playerGame.definePosition(player.position.x, player.position.y);
    }
}

const initMap = (context) => {
    context.map = context.make.tilemap({key: 'bomb-field', tileWidth: 16, tileHeight: 16});
    context.tileset = context.map.addTilesetImage('bomb-field', 'tiles');
    context.groundLayer = context.map.createLayer('ground', context.tileset, 0, 0);
    context.physics.world.setBounds(0, 0, context.map.widthInPixels, context.map.heightInPixels);

    context.wallsLayer = context.map.createLayer('walls', context.tileset, 0, 0);
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

const showDebugPlayer = (player) => {
    const debugGraphics = player.scene.add.graphics().setAlpha(0.7);
    player.body.debugGraphic = debugGraphics;
    player.scene.physics.world.debugGraphic = debugGraphics;

    player.scene.physics.world.createDebugGraphic();

    player.scene.physics.world.debugGraphic.clear();
    player.body.debugGraphic.clear();

    player.scene.physics.world.debugGraphic.lineStyle(1, 0xffffff);// branco
    player.scene.physics.world.debugGraphic.strokeRect(player.body.position.x, player.body.position.y, player.body.width, player.body.height);
    //
    player.scene.physics.world.debugGraphic.fillStyle(0x0000ff, 0.5); // azul
    player.scene.physics.world.debugGraphic.fillRect(player.body.position.x, player.body.position.y, player.body.width, player.body.height);

    // Posição visual atual do player
    // player.scene.physics.world.debugGraphic.lineStyle(1, 0x00ff00); // verde
    // player.scene.physics.world.debugGraphic.strokeRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);

    // Posição do body do player
    // player.scene.physics.world.debugGraphic.lineStyle(1, 0xff0000); // vermelho
    // player.scene.physics.world.debugGraphic.strokeRect(player.body.x, player.body.y, player.body.width, player.body.height);
    console.log('buceta')
}

export const gameScene = new Game();