const express = require("express");
const cors = require('cors');
const http = require("http");
const {Server} = require("socket.io");
const routes = require('./routes');
const {getPlayerByToken} = require("./controllers/loginController");
const Lobby = require("./models/Lobby");
const Message = require('./models/Message');

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
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);

                if (socket.playerId) {
                    this.lobby.removePlayer(socket.playerId);
                    this.io.emit('playerLeftLobby', socket.playerId);
                }
            });

            socket.on('identify', async (data) => {
                if (data.token) {
                  const player = await getPlayerByToken(data.token);
                  if (player) {
                    socket.playerId = player.id;
                    console.log(player)
                    socket.emit('identified', player);
                    if (!this.lobby.hasPlayer(player.id)) {
                      this.lobby.addPlayer(player);
                      console.log('AI PAISDA', player);         
                      this.io.emit('newPlayerInLobby', player);
                    }
                  } else {
                    socket.emit('error', { error: 'Invalid token' });
                  }
                }
            });

            socket.on('addLobbyMessage', ({ playerName, messageContent }) => {
                this.lobby.addMessage(playerName, messageContent);
                console.log()
                this.io.emit('lobbyMessages', this.lobby.getMessages());
            });

            socket.on('getLobbyPlayers', () => {
                const players = this.lobby.getPlayers();
                console.log(players);
                socket.emit('lobbyPlayers', players);
            });
              
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