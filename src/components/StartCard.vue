<script setup lang="ts">
import { ref } from 'vue'
import InputField from './InputField.vue'
import BaseButton from './BaseButton.vue'

const emit = defineEmits<{ (e: 'start', playerName: string): void }>()
const name = ref('')

function startGame() {
  const val = name.value.trim()
  if (!val) return
  emit('start', val)
}
</script>

<template>
  <div class="w-full max-w-lg not-visited:text-center p-6 rounded-xl text-[#1B1B1F]">
    <h1 class="text-5xl font-semibold">Bienvenido,</h1>
    <h1 class="text-5xl font-semibold">entrenador!</h1>
    <br>
    <p class="text-lg text-[#1B1B1F] mt-2">Introduce tu nombre de usuario para comenzar tu viaje</p>

    <div class="mt-8">
      <InputField v-model="name" placeholder="e.g., Ash Ketchum" />
    </div>

    <div class="mt-4 flex justify-end">
      <BaseButton @click="startGame" :fullWidth="true" :bgColor="'bg-[#FFDE00]'" :textColor="'text-[#1B1B1F]'"
        :disabled="!name.trim()">
        Iniciar juego!
      </BaseButton>
    </div>
  </div>
</template>
