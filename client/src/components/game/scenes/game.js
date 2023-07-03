import Phaser from 'phaser'
import {Player} from "../classes/Player.js";
import {socket} from "@/assets/js/socket";

export class Game extends Phaser.Scene {
    constructor() {
        super('game');
        this.socket = socket;
    }

    create() {
        initMap(this);
        this.player = new Player(this, 100, 100, 'player');
        this.bombs = [];
        this.physics.add.collider(this.player, this.wallsLayer);
    }

    update() {
        const player = this.player;

        if (!player) return;

        player.update();
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