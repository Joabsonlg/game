<script setup>
import Phaser from "phaser";
import { Boot } from "@/components/game/scenes/boot";
import { PreGame } from "@/components/game/scenes/preGame";
import { GameEnd } from "@/components/game/scenes/gameEnd";
import { gameScene } from "@/components/game/scenes/game";
import { uiScene } from "@/components/game/scenes/ui/UI";
import { onMounted } from "vue";
import { usePlayerStore } from "@/stores/player";
import { socket } from "@/assets/js/socket";
import { useRoute } from "vue-router";
import { useGameStore } from "@/stores/game";

const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 624,
  parent: 'gameCanvas',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 0},
    },
  },
  backgroundColor: '#2d2d2d',
  scene: [Boot, PreGame, gameScene, uiScene, GameEnd]
}

const route = useRoute();
const roomId = route.params.roomId;
gameScene.roomId = roomId;

const playerStore = usePlayerStore();
const gameStore = useGameStore();

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
    socket.playerId = player.id;
  });

  socket.on('playerMoved', (player) => {
    gameScene.movePlayer(player);
  });

  socket.on('bombAdded', (bomb) => {
    gameScene.addBomb(bomb);
  });

  socket.on('bombExploded', (bomb) => {
    gameScene.explodeBomb(bomb);
  });

  socket.on('itemCollected', (data) => {
    gameScene.collectItem(data.itemCollected);
  });

  socket.on('playerUpdated', (player) => {
    gameScene.updatePlayer(player);
  });

  socket.on('playerDead', () => {
    console.log("escutei ele morrendo")
    const player = gameScene.players.get(socket.playerId);
    if (player) {
      player.isAlive = false;
    }
  });



  presentation(socket);

  window.game = new Phaser.Game(config);
})
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