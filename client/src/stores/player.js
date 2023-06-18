import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

export const usePlayerStore = defineStore('player', () => {
    const player = ref(null)

    const setPlayer = (newPlayer) => {
        player.value = newPlayer
    }

    const getPlayer = computed(() => player.value);

    return {setPlayer, getPlayer}
})
