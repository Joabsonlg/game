<template>
  <div class="card">
    <div class="card-header">
      <h1>Lobby</h1>
    </div>
    <div class="card-body lobby">
      <div class="row">
        <div class="col-6">
          <div class="message-list">
            <h2>Messages:</h2>
            <ul>
              <li v-for="message in messages" :key="message.id">
                <strong>{{ message.playerUsername }}:</strong> {{ message.content }}
              </li>
            </ul>
            <div class="message-input">
              <input v-model="newMessage" type="text" placeholder="Enter a message" />
              <button @click="sendMessage">Send</button>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="player-list">
            <div class="d-flex">
              <h2>Jogos disponíveis:</h2>
            </div>
            <div class="row" style="margin-top: 10px">
              <div class="col-12">
                <table class="game-table">
                  <thead style="text-align: left">
                    <tr>
                      <th>Room ID</th>
                      <th>Players</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="game in availableGames" :key="game.roomId">
                      <td>{{ game.roomId }}</td>
                      <td>{{ game.players }}</td>
                      <td>{{ game.status }}</td>
                      <td>
                        <button
                          @click="joinGame(game.roomId)"
                          v-if="game.owner !== socket.playerId && game.status === 'WAITING'"
                        >
                          Entrar
                        </button>
                        <button
                          @click="startGame(game.roomId)"
                          :disabled="game.players < 2"
                          v-if="game.owner === socket.playerId && game.status === 'WAITING'"
                        >
                          Iniciar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <button
                @click="createGame"
                v-if="availableGames.find((game) => game.owner === socket.id) === undefined"
                class="ml-auto"
              >
                Criar jogo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import io from 'socket.io-client';
import {usePlayerStore} from "@/stores/player";
import {useGameStore} from "@/stores/game";
import router from "@/router";

const socket = io('http://localhost:3000');
const playerStore = usePlayerStore();
const gameStore = useGameStore();

const players = ref([]);
const messages = ref([]);
const newMessage = ref('');
const availableGames = ref([]);

const addLobbyMessage = (playerName, messageContent) => {
  const message = {
    id: Date.now(), // Identificador único para a mensagem (pode ser gerado de outra forma se preferir)
    playerUsername: playerName,
    content: messageContent
  };

  messages.value.push(message);
};

socket.on('lobbyPlayers', (lobbyPlayers) => {
  players.value = lobbyPlayers;
});

socket.on('availableGames', (games) => {
  availableGames.value = games;
});

socket.on('lobbyMessages', (lobbyMessages) => {
  messages.value = lobbyMessages;
});

socket.on('newPlayerInLobby', (player) => {
  players.value.push(player);
  addLobbyMessage(player.username, 'has entered the chat.');
});

socket.on('playerLeftLobby', (playerId) => {
  const player = players.value.find((p) => p.id === playerId);
  if (player) {
    players.value = players.value.filter((p) => p.id !== playerId);
    addLobbyMessage(player.username, 'has left the chat.');
  }
});

socket.on('identified', (player) => {
  playerStore.setPlayer(player);
  socket.playerId = player.id;
  socket.emit('getLobbyPlayers');
  socket.emit('getAvailableGames');
});

socket.on('gameStarted', (gameState) => {
  const roomId = gameState.roomId;
  gameStore.setGameState(gameState);
  router.push({name: 'game', params: {roomId}});
});

const createGame = () => {
  socket.emit('createGame');
};

const joinGame = (roomId) => {
  socket.emit('joinGame', {roomId});
};

const startGame = (roomId) => {
  socket.emit('startGame', {roomId});
};

const sendMessage = () => {
  if (newMessage.value.trim() === '') {
    return;
  }

  const playerName = playerStore.getPlayer.username;
  const messageContent = newMessage.value.trim();

  socket.emit('addLobbyMessage', {playerName, messageContent});

  newMessage.value = '';
};

onMounted(() => {
  socket.emit('identify', {token: localStorage.getItem('token')});
});
</script>

<style scoped>
.lobby {
  max-height: 500px;
  overflow-y: auto;
}

h1 {
  margin-bottom: 1rem;
}

.message-list {
  max-width: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
}

.message-list h2 {
  margin-bottom: 0.5rem;
}

.player-list {
  max-width: 500px;
  overflow-y: auto;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1rem;
}

.player-list h2 {
  margin-bottom: 0.5rem;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 0.5rem;
}

.message-input {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
}

.message-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

button:focus {
  outline: none;
}

button:disabled {
  background-color: #5f84ad;
  cursor: not-allowed;
}

.game-table {
  width: 100%;
  border-collapse: collapse;
}

.game-table th,
.game-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
}

.game-table th {
  font-weight: bold;
}
</style>






