const express = require("express");
const cors = require('cors');
const http = require("http");
const {Server} = require("socket.io");
const routes = require('./routes');
const {getPlayerByToken} = require("./controllers/loginController");

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
            });

            socket.on('identify', async (data) => {
                if (data.token) {
                    const player = await getPlayerByToken(data.token);
                    if (player) {
                        socket.playerId = player.id;
                        console.log(player)
                        socket.emit('identified', player);
                    } else {
                        socket.emit('error', {error: 'Invalid token'});
                    }
                }
            });

            socket.on('chatMessage', (message) => {
                this.io.emit('chatMessage', message);
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