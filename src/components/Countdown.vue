<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  startFrom?: number
  class?: string,
  final?: boolean
}>()

const emit = defineEmits<{
  (e: 'finished', isFinal: boolean): void
}>()

const value = ref<number | null>(null)

let timer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  const start = props.startFrom ?? 3
  value.value = start
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  timer = setInterval(() => {
    if (!value.value) return
    if (value.value > 1) {
      value.value = value.value - 1
    } else {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
      value.value = null

      emit('finished', !!props.final)


    }
  }, 1000)
}

onMounted(() => startCountdown())
onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>

  <span v-if="value !== null" :class="props.class">{{ value }}</span>

</template>

<style scoped>
.text-6xl {
  transition: transform 160ms ease, opacity 160ms ease;
}
</style>
