<script setup lang="ts">
import Header from '../components/Header.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const playerName = computed(() => (route.query.name as string) ?? '')
const finalScore = computed(() => {
  const s = route.query.score
  if (typeof s === 'string') return s
  if (typeof s === 'number') return String(s)
  return ''
})

function playAgain() {
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#F1F1F1] to-[#C4C7F2] bg-fixed p-4 flex flex-col gap-4 items-start">
    <Header :classImage="'h-8 md:h-24 w-auto block'" />
    <div class="w-full flex justify-center mt-6">
      <div class="w-full max-w-2xl bg-white/80 rounded-lg shadow p-6 text-center">
        <h1 class="text-3xl font-bold mb-2">Resultado Final</h1>
        <p class="text-lg text-gray-700">Entrenador: <span class="font-semibold">{{ playerName }}</span></p>
        <p class="text-lg text-gray-700 mt-2">Puntaje final: <span class="font-semibold text-2xl">{{ finalScore }}</span></p>
        <div class="mt-6 flex justify-center">
          <button @click="playAgain" class="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded">Jugar otra vez</button>
        </div>
      </div>
    </div>
  </div>
</template>
