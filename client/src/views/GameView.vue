<template>
  <div class="game">
    <canvas id="gameCanvas" width="800" height="600"></canvas>
  </div>
</template>

<script setup>
import {onMounted} from 'vue'
import io from 'socket.io-client';
import {usePlayerStore} from "@/stores/player";

const socket = io('http://localhost:3000');
const playerStore = usePlayerStore();

onMounted(() => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  socket.on('connect', () => {
    console.log('connected');
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

  socket.on('error', (error) => {
    alert(error);
  });

  socket.on('identified', (player) => {
    playerStore.setPlayer(player);
    initGame(player);
  });

  presentation();
})

const presentation = () => {
  const canvas = document.getElementById('gameCanvas')
  const ctx = canvas.getContext('2d')

  ctx.font = '48px serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText('Cloud Wars', canvas.width / 2, canvas.height / 2)

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    socket.emit('identify', {token: localStorage.getItem('token')});
  }, 2000)
}

const initGame = (player) => {
  const canvas = document.getElementById('gameCanvas')
  const ctx = canvas.getContext('2d')

  ctx.font = '24px serif'
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText(`Welcome ${player.username}`, canvas.width / 2, canvas.height / 2)

  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, 2000)
}
</script>

<style>
@media (min-width: 1024px) {
  .game {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  canvas {
    border: 1px solid #000;
    border-radius: 5px;
  }
}
</style>