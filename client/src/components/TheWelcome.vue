<script setup>
import {usePlayerStore} from "@/stores/player";
import {computed} from "vue";

const playerStore = usePlayerStore();
const player = computed(() => playerStore.getPlayer);
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h1>Bomberman remake</h1>
      <div class="wrapper d-flex justify-content-between">
        <nav class="g-3">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register">Cadastro</RouterLink>
          <RouterLink to="/lobby">Lobby</RouterLink>
        </nav>
        <span>{{player}}</span>
      </div>
    </div>
    <div class="card-body">
      Esse é a página inicial do jogo. Aqui você pode ver suas informações e iniciar uma nova aventura.
    </div>
  </div>
</template>

<style scoped>
.g-1 {
  display: flex;
  gap: 0.25rem;
}

.g-2 {
  display: flex;
  gap: 0.5rem;
}

.g-3 {
  display: flex;
  gap: 1rem;
}

.d-flex {
  display: flex;
}

.justify-content-between {
  justify-content: space-between;
}
</style>
