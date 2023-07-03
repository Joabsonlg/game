<script setup>
import {RouterView} from 'vue-router'
import {usePlayerStore} from "@/stores/player";
import {computed} from "vue";
import Spinner from "@/components/Spinner.vue";

const playerStore = usePlayerStore();
const player = computed(() => playerStore.getPlayer);
</script>

<template>
  <Spinner v-if="!player && $route.path === '/game'"/>
  <RouterView/>
</template>

<style scoped>
</style>
