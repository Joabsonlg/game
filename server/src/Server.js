const express = require("express");
const cors = require('cors');
const http = require("http");
const {Server} = require("socket.io");
const routes = require('./routes');
const {getPlayerByToken} = require("./controllers/loginController");
const Lobby = require("./models/Lobby");
const Message = require('./models/Message');
const {v4: UUIDv4} = require('uuid');
const Game = require("./game/Game");

class GameServer {
    constructor() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST'],
            },
        });
        this.lobby = new Lobby();
        this.games = [];
    }

    /**
     * Initialize the server and start listening for connections
     */
    initialize() {
        this.configureServer();
        this.handleConnections();
        this.startListening();
    }

    /**
     * Configure the express app
     */
    configureServer() {
        this.app.use(cors());
        this.app.use(express.json());
        routes(this.app);
    }

    /**
     * Handle incoming socket connections
     */
    handleConnections() {
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.id}`);

            socket.on('identify', async (data) => {
                if (data.token) {
                    const player = await getPlayerByToken(data.token);
                    if (player) {
                        socket.playerId = player.id;
                        socket.emit('identified', player);
                    } else {
                        socket.emit('error', {error: 'Invalid token'});
                    }
                } else {
                    socket.emit('error', {error: 'Invalid token'});
                }
            });

            socket.on('addLobbyMessage', ({playerName, messageContent}) => {
                this.lobby.addMessage(playerName, messageContent);
                console.log()
                this.io.emit('lobbyMessages', this.lobby.getMessages());
            });

            socket.on('getLobbyPlayers', () => {
                const players = this.lobby.getPlayers();
                console.log(players);
                socket.emit('lobbyPlayers', players);
            });

            socket.on('createGame', () => {
                const roomId = UUIDv4();
                const game = new Game(roomId, socket.id);
                game.setSocketIO(this.io);
                this.games.push(game);
                this.io.to(socket.id).emit('gameCreated', {roomId});

                game.addPlayer(socket)
                this.io.emit('availableGames', this.findAvailableGames());
            });

            socket.on('joinGame', (data) => {
                const game = this.getGameByRoomId(data.roomId);
                if (game) {
                    game.addPlayer(socket);
                    this.io.to(socket.id).emit('gameJoined', {roomId: data.roomId});
                    this.io.emit('availableGames', this.findAvailableGames());
                } else {
                    this.io.to(socket.id).emit('error', {error: 'Game not found'});
                }
            });

            socket.on('startGame', (data) => {
                const game = this.getGameByRoomId(data.roomId);
                if (game) {
                    game.start(socket.id);
                } else {
                    this.io.to(socket.id).emit('error', {error: 'Game not found'});
                }
            });

            socket.on('playerMove', (data) => {
                const game = this.getGameByRoomId(data.roomId);
                if (game) {
                    game.playerMove(socket.id, data.direction, data.position);
                } else {
                    this.io.to(socket.id).emit('error', {error: 'Game not found'});
                }
            });

            socket.on('disconnect', () => {
                const game = this.games.find((game) => game.players.find((player) => player.id === socket.id));
                if (game) {
                    game.removePlayer(socket.id);
                    if (game.players.length === 0) {
                        console.log(`Game ${game.roomId} deleted`);
                        this.games = this.games.filter((g) => g.roomId !== game.roomId);
                    }
                }
            });

            socket.on('getAvailableGames', () => {
                socket.emit('availableGames', this.findAvailableGames());
            });
        });
    }

    /**
     * Get the game by room id
     */
    getGameByRoomId(roomId) {
        return this.games.find((game) => game.roomId === roomId);
    }

    /**
     * Find available games
     */
    findAvailableGames() {
        return this.games.filter((game) => game.gameStatus === 'WAITING').map((game) => {
            return {
                roomId: game.roomId,
                players: game.players.length,
                owner: game.principal,
            }
        });
    }

    /**
     * Start listening for connections
     */
    startListening() {
        const port = process.env.PORT || 3000;
        this.server.listen(port, () => {
            console.log(`Listening on *:${port}`);
        });
    }
}

module.exports = GameServer;