import Phaser from 'phaser'
import {Player} from "../classes/Player.js";
import {socket} from "@/assets/js/socket";
import {Bomb} from "@/components/game/classes/Bomb";
import {Item} from "@/components/game/classes/Item";

export default class Game extends Phaser.Scene {
    constructor() {
        super('game');
        this.socket = socket;
    }

    create() {
        initMap(this);

        if (!this.bombs) {
            this.bombs = this.add.group();
        }

        this.physics.add.collider(this.players, this.wallsLayer);
        this.physics.add.collider(this.players, this.bombs);
    }

    update() {
        if (!this.players) return;

        const players = this.players.getChildren();

        players.forEach((player) => {
            player.update();
        });
    
        const bombs = this.bombs.getChildren();
        bombs.forEach((bomb) => {
            bomb.update();
        });
    
        const alivePlayers = players.filter((player) => player.isAlive);
        
        if (alivePlayers.length === 1) {
            const winner = alivePlayers[0];
      
            if (winner.playerId === this.socket.playerId) {
              this.scene.start('gameEnd', { message: 'Parabéns! Você venceu!' });
            } else {
              this.scene.start('gameEnd', { message: 'Você perdeu! Melhor sorte na próxima vez.' });
            }
        }
    }

    addPlayer(player) {
        if (!this.players) {
            this.players = this.add.group();
        }

        const playerGame = new Player(this, player.position.x, player.position.y, player.sprite);
        playerGame.playerId = player.id;
        playerGame.isAlive = true;
        this.players.add(playerGame.setDepth(1), true);
    }
    

    addItem(item) {
        if (!this.items) {
            this.items = this.add.group();
        }

        const itemGame = new Item(this, item.x, item.y, item.sprite);
        itemGame.id = item.id;
        this.items.add(itemGame.setDepth(1), true);
    }

    findPlayerSpriteById(playerId) {
        return this.players.getChildren().find(sprite => sprite.playerId === playerId);
    }

    movePlayer(player) {
        const playerGame = this.findPlayerSpriteById(player.id);

        if (player.id === this.socket.playerId) return;

        playerGame.definePosition(player.position.x, player.position.y);
    }

    updatePlayer(player) {
        const playerGame = this.findPlayerSpriteById(player.id);

        playerGame.updatePlayer(player);
    }

    addBomb(bomb) {
        const item = new Bomb(this, bomb.x, bomb.y, 'bomb');
        item.id = bomb.id;
        this.bombs.add(item.setDepth(1), true);
    }

    explodeBomb(bomb) {
        const item = this.bombs.getChildren().find(it => {
            return bomb.id === it.id
        });
        item.explode();
    }

    collectItem(item) {
        const object = this.items.getChildren().find(it => {
            return item.id === it.id
        });
        object.destroy();
    }
}

const initMap = (context) => {
    context.map = context.make.tilemap({key: 'bomb-field', tileWidth: 16, tileHeight: 16});
    context.tileset = context.map.addTilesetImage('bomb-field', 'tiles');
    context.groundLayer = context.map.createLayer('ground', context.tileset, 0, 0);
    context.physics.world.setBounds(0, 0, context.map.widthInPixels, context.map.heightInPixels);

    context.wallsLayer = context.map.createLayer('walls', context.tileset, 0, 0);
    context.wallsLayer.setCollisionByProperty({collides: true});

    context.cameras.main.setZoom(3)

    // Centralize o mapa na tela
    const centerX = context.map.widthInPixels / 2;
    const centerY = context.map.heightInPixels / 2;
    context.cameras.main.scrollX = centerX - context.cameras.main.width / 2;
    context.cameras.main.scrollY = centerY - context.cameras.main.height / 2;


    // showDebugWalls(context);
}

const showDebugWalls = (context) => {
    const debugGraphics = context.add.graphics().setAlpha(0.7);
    context.wallsLayer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    });
}

export const gameScene = new Game();