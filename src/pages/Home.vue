<script setup lang="ts">

import Header from '../components/Header.vue'

import { useRouter } from 'vue-router'
import StartCard from '../components/StartCard.vue'

const router = useRouter()

function onStart(playerName: string) {
  router.push({ name: 'Game', query: { name: playerName } })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#F1F1F1] to-[#C4C7F2]  bg-fixed p-4 flex flex-col gap-4 items-start">
    <Header :classImage="'h-12 md:h-auto w-auto block'" />
    <div class="w-full flex justify-center mt-6">
      <StartCard @start="onStart" />
    </div>
  </div>
</template>




