<template>
  <div class="lobby">
    <h1>Lobby</h1>
    <div class="lobby-content">
      <div class="message-list">
        <h2>Messages:</h2>
        <ul>
          <li v-for="message in messages" :key="message.id">
            <strong>{{ message.playerUsername  }}:</strong> {{ message.content }}
          </li>
        </ul>
      </div>

      <div class="player-list">
        <h2>Players:</h2>
        <ul>
          <li v-for="player in players" :key="player.id">
            {{ player.username }}
          </li>
        </ul>
      </div>
    </div>
    <div class="message-input">
      <input v-model="newMessage" type="text" placeholder="Enter a message" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import io from 'socket.io-client';
import { usePlayerStore } from "@/stores/player";

const socket = io('http://localhost:3000');
const playerStore = usePlayerStore();

const players = ref([]);
const messages = ref([]);
const newMessage = ref('');

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
});

const sendMessage = () => {
  if (newMessage.value.trim() === '') {
    return;
  }

  const playerName = playerStore.getPlayer.username;
  const messageContent = newMessage.value.trim();

  socket.emit('addLobbyMessage', { playerName, messageContent });

  newMessage.value = '';
};

onMounted(() => {
  socket.emit('identify', { token: localStorage.getItem('token') });
});
</script>

<style scoped>
.lobby {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f1f1f1;
}

h1 {
  margin-bottom: 1rem;
}

.lobby-content {
  display: flex;
  justify-content: space-between;
  width: 80%;
  max-width: 800px;
  background-color: #fff;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.player-list {
  flex: 1;
}

.player-list h2 {
  margin-bottom: 0.5rem;
}

.message-list {
  flex: 2;
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
