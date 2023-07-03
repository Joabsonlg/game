<script setup>
import Phaser from "phaser";
import {Boot} from "@/components/game/scenes/boot";
import {PreGame} from "@/components/game/scenes/preGame";
import {Game} from "@/components/game/scenes/game";
import {UIScene} from "@/components/game/scenes/ui/UI";
import {onMounted} from "vue";
import {usePlayerStore} from "@/stores/player";
import {socket} from "@/assets/js/socket";

const config = {
  type: Phaser.AUTO,
  width: 608,
  height: 512,
  parent: 'gameCanvas',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
    }
  },
  backgroundColor: '#2d2d2d',
  scene: [Boot, PreGame, Game, UIScene]
}

const playerStore = usePlayerStore();

const presentation = (socket) => {
  setTimeout(() => {
    socket.emit('identify', {token: localStorage.getItem('token')});
  }, 2000)
}

onMounted(() => {
  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('error', (error) => {
    alert(error.error);
  });

  socket.on('identified', (player) => {
    playerStore.setPlayer(player);
    createGame();
  });

  socket.on('gameCreated', (game) => {
    console.log(`Game created: ${game.roomId}`);
  });

  socket.on('gameJoined', (game) => {
    console.log(`Game joined: ${game.roomId}`);
  });

  let created = false;

  socket.on('availableGames', (games) => {
    if (!created) {
      joinGame(games[0].roomId)
      created = true;
    }
  });

  presentation(socket);

  window.game = new Phaser.Game(config);
})

const createGame = () => {
  socket.emit('createGame');
}

const joinGame = (room) => {
  socket.emit('joinGame', {roomId: room});
}
</script>

<template>
  <div id="gameCanvas"></div>
</template>

<style scoped>
#gameCanvas {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

canvas {
  border-radius: 10px;
}
</style>