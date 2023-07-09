// stores/game.js
import {defineStore} from 'pinia'
import {ref} from "vue";

export const useGameStore = defineStore('game', () => {
    const gameState = ref({})

    const setGameState = (newGameState) => {
        gameState.value = newGameState
    }

    return {gameState, setGameState}
})