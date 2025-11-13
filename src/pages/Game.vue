<script setup lang="ts">
import Header from '../components/Header.vue'
import Countdown from '../components/Countdown.vue'
import BaseCard from '../components/BaseCard.vue'
import { ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

const showContent = ref(false)

const playerName = ref<string>((route.query.name as string) ?? '')
const score = ref(0)

const navigated = ref(false)
const mainCard = ref<any>(null)


let answerTimeout: ReturnType<typeof setTimeout> | null = null

function callFinal() {
  if (!navigated.value) {
    navigated.value = true
    try {
      if (answerTimeout) { clearTimeout(answerTimeout); answerTimeout = null }
    } catch (e) { }
    router.push({ name: 'Final', query: { name: playerName.value, score: String(score.value) } })
  }
}

function onCountdownFinished() {
  showContent.value = true
  nextTick(() => {
    try {
      mainCard.value?.refreshResults?.(4)
    } catch (e) {

    }
  })
}

function onAnswerSelected(payload: { id: number; name: string; isCorrect: boolean }) {
  if (payload.isCorrect) score.value++

  if (answerTimeout) clearTimeout(answerTimeout)
  answerTimeout = setTimeout(() => {
    showContent.value = false

    answerTimeout = null
  }, 2000)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#F1F1F1] to-[#C4C7F2]  bg-fixed p-4 flex flex-col gap-4 items-start">
    <Header :classImage="'h-8 md:h-24 w-auto block'" />
    <div class="w-full flex justify-end items-center gap-2 mt-2 pr-4">
      <div class="text-xl text-gray-700">Entrenador: {{ playerName }}</div>
      <div class="text-xl text-gray-700">Puntaje: <span class="font-bold">{{ score }}</span></div>
      <div class="text-xl text-gray-700">Tiempo:
        <Countdown @finished="(isFinal) => isFinal && callFinal()" :startFrom="120" :class="'font-mono'"
          :final="true" />
      </div>
    </div>
    <div class="w-full flex justify-center mt-6">
      <div class="w-full max-w-3xl flex flex-col items-center gap-4">
        <div class="text-center">
          <template v-if="!showContent">
            <div class="flex flex-col items-center justify-center">
              <Countdown @finished="onCountdownFinished" :startFrom="3"
                :class="'text-6xl md:text-8xl font-extrabold'" />
            </div>

            <div class="text-sm text-gray-500 mt-2">Preparado...</div>
          </template>
          <template v-else>

            <BaseCard ref="mainCard" @answerSelected="onAnswerSelected">
              <div class="text-center">

              </div>
              <template #clues>
                <div class="text-center">
                  <h2 class="text-xl font-bold">Pistas</h2>
                </div>
              </template>
            </BaseCard>
          </template>
        </div>

      </div>

    </div>

  </div>
</template>