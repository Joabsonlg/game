<template>
  <div class="card">
    <div class="card-header">
      <h1>Lobby</h1>
    </div>
    <div class="card-body lobby">
      <div class="row">
        <div class="col-6">
          <div class="player-list">
            <h2>Players online:</h2>
            <ul>
              <li v-for="player in players" :key="player.id">
                {{ player.username }}
              </li>
            </ul>
          </div>
        </div>
        <div class="col-6">
          <div class="player-list">
            <div class="d-flex">
              <h2>Jogos disponíveis:</h2>
              <button @click="createGame">Criar jogo</button>
            </div>
            <div class="row">
              <div class="col-12">
                <table>
                  <thead>
                  <tr>
                    <th>Room ID</th>
                    <th>Players</th>
                    <th></th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="game in availableGames" :key="game.roomId">
                    <td>{{ game.roomId }}</td>
                    <td>{{ game.players }}</td>
                    <td>
                      <button @click="joinGame(game.roomId)" v-if="game.owner !== socket.id">Entrar</button>
                      <button @click="startGame(game.roomId)" v-if="game.owner === socket.id">Iniciar</button>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="message-list">
            <h2>Messages:</h2>
            <ul>
              <li v-for="message in messages" :key="message.id">
                <strong>{{ message.playerUsername }}:</strong> {{ message.content }}
              </li>
            </ul>
            <div class="message-input">
              <input v-model="newMessage" type="text" placeholder="Enter a message"/>
              <button @click="sendMessage">Send</button>
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
import router from "@/router";

const socket = io('http://localhost:3000');
const playerStore = usePlayerStore();

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
  socket.emit('getLobbyPlayers');
  socket.emit('getAvailableGames');
});

const createGame = () => {
  socket.emit('createGame');
};

const joinGame = (roomId) => {
  socket.emit('joinGame', {roomId});
};

const startGame = (roomId) => {
  router.push({name: 'game', params: {roomId}});
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

.player-list {
  flex: 1;
}

.player-list h2 {
  margin-bottom: 0.5rem;
}

.message-list {
  max-width: 500px;
  overflow-y: auto;
}

.message-list h2 {
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
</style>
