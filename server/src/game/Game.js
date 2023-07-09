const Player = require("./Player");
const Bomb = require("./Bomb");
const Item = require("./Item");

/**
 * Represents a game.
 * @class
 */
class Game {
    /**
     * Creates a new instance of Bomberman Game.
     */
    constructor(roomId, principalId) {
        this.roomId = roomId;
        this.players = [];
        this.bombs = [];
        this.items = [];
        this.gameStatus = 'WAITING';
        this.sprites = ['player', 'player2', 'player3', 'player4'];
        this.principal = principalId;
    }

    /**
     * Set the socket.io instance.
     * @param io
     */
    setSocketIO(io) {
        this.io = io;
    }

    /**
     * Add a player to the game.
     */
    addPlayer(socket) {
        if (!this.isFull()) {
            if (this.players.find((player) => player.id === socket.playerId)) {
                return socket.emit('error', {error: 'Player already added'});
            }

            const player = new Player(socket.playerId, this.selectSprite());

            if (this.players.length === 0) {
                this.principal = player.id;
            }
            this.players.push(player);

            socket.join(this.roomId);
            socket.emit('playerAdded', player);
            this.io.to(this.roomId).emit('playersUpdated', this.players);
        } else {
            return socket.emit('error', {error: 'Game is full'});
        }
    }

    /**
     * Remove a player from the game.
     */
    removePlayer(playerId) {
        const index = this.players.findIndex((player) => player.id === playerId);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }

    /**
     * Add a bomb to the game.
     * @param playerId
     */
    addBomb(playerId) {
        const player = this.players.find((player) => player.id === playerId);

        if (!this.canAddBomb(playerId)) return;

        if (player) {
            const bomb = new Bomb(player.position.x, player.position.y);
            player.timeOfLastBomb = new Date();
            this.bombs.push(bomb);
            this.io.to(this.roomId).emit('bombAdded', bomb);
            console.log(`A bomba ${bomb.id} foi adicionada`);
            setTimeout(() => {
                console.log(`A bomba ${bomb.id} explodiu`);
                this.io.to(this.roomId).emit('bombExploded', bomb);

                // verificar se existe algum jogador no raio de 20
                const radius = 30;
                const players = this.players.filter((player) => {
                    return player.position.x >= bomb.x - radius && player.position.x <= bomb.x + radius &&
                        player.position.y >= bomb.y - radius && player.position.y <= bomb.y + radius;
                });
                players.forEach((player) => {
                    player.removeLife();
                    this.io.to(this.roomId).emit('playerUpdated', player);


                    console.log(player.lives)
                    if(player.lives === 0){
                        console.log("DESGRAÇA MORREU")
                        this.io.to(this.roomId).emit('playerDead', player);
                    }

                    console.log(`O player ${player.id} perdeu uma vida`);
                });
            }, 3000);
            console.log(`A bomba ${bomb.id} vai explodir em 3 segundos`);
        }
    }

    /**
     * Check if the game is full.
     */
    isFull() {
        return this.players.length >= 4;
    }

    /**
     * Select a random sprite for the player.
     */
    selectSprite() {
        return this.sprites.splice(Math.floor(Math.random() * this.sprites.length), 1)[0];
    }

    /**
     * Find a bomb at the given position.
     */
    findBomb(x, y) {
        return this.bombs.find((bomb) => bomb.x === x && bomb.y === y);
    }

    /**
     * Verify if the player can add a bomb.
     * @param playerId
     */
    canAddBomb(playerId) {
        const player = this.players.find((player) => player.id === playerId);

        const now = new Date();
        const diff = now - player.timeOfLastBomb;
        if (diff < 2000) return false;

        const bomb = this.findBomb(player.position.x, player.position.y);
        return !bomb;
    }

    /**
     * Generate items for the game.
     */
    generateItems() {
        const itemPositions = [
            {x: 90, y: 80},
            {x: 184, y: 170},
        ];

        const types = ['life', 'speed'];

        itemPositions.forEach((position) => {
            const type = types[Math.floor(Math.random() * types.length)];
            const item = new Item(type, position.x, position.y, type);
            this.items.push(item);
        });
    }

    /**
     * Handle a player collecting an item.
     * @param {string} playerId - The id of the player who collected the item.
     */
    collectItem(playerId) {
        const player = this.players.find((player) => player.id === playerId);

        if (player) {
            // verificar se existe algum item na posição do player, considerar a largura e altura do player e do item
            let itemCollected = null;
            this.items.forEach((item) => {
                if (player.position.x >= item.x - 20 && player.position.x <= item.x + 20 &&
                    player.position.y >= item.y - 20 && player.position.y <= item.y + 20) {
                    itemCollected = item;
                }
            });

            if (itemCollected) {
                itemCollected.applyEffect(player, this.io, this.roomId);

                console.log(`O player ${playerId} coletou o item ${itemCollected.id}`);
                this.io.to(this.roomId).emit('itemCollected', {playerId, itemCollected});
                this.io.to(this.roomId).emit('playerUpdated', player);

                const itemIndex = this.items.findIndex((i) => i.id === itemCollected.id);
                if (itemIndex !== -1) {
                    this.items.splice(itemIndex, 1);
                }
            }
        }
    }

    /**
     * Set the game status.
     */
    setStatus(status) {
        this.gameStatus = status;
    }

    /**
     * Start the game.
     */
    start(playerId) {
        if (this.gameStatus !== 'WAITING') {
            return this.io.to(playerId).emit('error', {error: 'Game already started.'});
        }

        if (this.principal !== playerId) {
            return this.io.to(playerId).emit('error', {error: 'Only the owner can start the game.'});
        }

        this.setStatus('STARTED');

        const gameState = this.getState();

        this.io.to(this.roomId).emit('gameStarted', gameState);
    }

    getState = () => {
        return {
            players: this.players,
            bombs: this.bombs,
            items: this.items,
            gameStatus: this.gameStatus,
            roomId: this.roomId,
            principal: this.principal
        }
    }

    /**
     * Update the player position.
     */
    playerMove(playerId, direction, position) {
        const player = this.players.find((player) => player.id === playerId);

        if (player) {
            player.direction = direction;
            player.position = position;

            this.collectItem(playerId);

            this.io.to(this.roomId).emit('playerMoved', player);
        } else {
            this.io.to(playerId).emit('error', {error: 'Player not found.'});
        }
    }
}

module.exports = Game;