<script setup lang="ts">
//definicion de props
const props = defineProps<{
  wrapperClass?: string
  innerClass?: string
  pokemonCard?: boolean,
  clues?: boolean
}>()

import { ref, watch, computed } from 'vue'

import { fetchMultipleRandomPokemon } from '../services/PokemonService'
import BaseButton from './BaseButton.vue'


// ref
const resultsStore = ref<Array<{ id: number; data: any; svg?: string | null; svgUrl?: string | null }>>([])

const pokeTypes = ref<string[]>([])
const pokeWeight = ref<number | null>(null)
const hintsReady = ref(false)

const showCenterCircle = ref(false)

const pokemonSvgUrl = ref<string | null>(null)

const selectedId = ref<number | null>(null)
const answered = ref<boolean>(false)


//computed/emit

const emit = defineEmits<{
  (e: 'answerSelected', payload: { id: number; name: string; isCorrect: boolean }): void
}>()

const displayWeight = computed(() => {
  if (!pokeWeight.value) {
    return 'Desconocido'
  }
  return `${pokeWeight.value / 10} kg`
})

const optionsComputed = computed(() => {
  const arr = resultsStore.value ?? []
  if (arr.length === 0) {
    return []
  }
  const targetId = arr[0]!.id

  const opts: Array<{ id: number; name: any; isCorrect: boolean }> = arr.map(r => ({ id: r.id, name: r.data?.name ?? `#${r.id}`, isCorrect: r.id === targetId }))
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = opts[i]!
    opts[i] = opts[j]!
    opts[j] = tmp
  }

  return opts
})

const selectedIsCorrect = computed(() => {
  const sel = optionsComputed.value.find(o => o.id === selectedId.value)
  return !!sel?.isCorrect
})

// functions

async function refreshResults() {
  hintsReady.value = false
  selectedId.value = null
  answered.value = false

  const maxAttempts = 6
  const retryDelayMs = 250

  const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

  let lastResults: any[] = []

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const results = await fetchMultipleRandomPokemon()
      lastResults = results
      resultsStore.value = results

      if (results.length === 0) {
        await sleep(retryDelayMs)
        continue
      }

      const candidate = results[0] as any
      const svgUrl = candidate?.svgUrl ?? null

      if (!svgUrl) {
        await sleep(retryDelayMs)
        continue
      }


      try {
        const resp = await fetch(svgUrl, { method: 'GET' })
        if (!resp.ok) {

          await sleep(retryDelayMs)
          continue
        }

        const ct = resp.headers.get('content-type') ?? ''
        if (!ct.includes('svg') && !svgUrl.endsWith('.svg')) {

          await sleep(retryDelayMs)
          continue
        }


        pokemonSvgUrl.value = svgUrl
        pokeTypes.value = candidate?.data?.types?.map((t: any) => t.type?.name).filter(Boolean) ?? []
        pokeWeight.value = candidate?.data?.weight ?? null
        hintsReady.value = true
        return results
      } catch (err) {
        await sleep(retryDelayMs)
        continue
      }
    } catch (err) {

      await sleep(retryDelayMs)
      continue
    }
  }


  if (lastResults.length > 0) {
    const candidate = lastResults[0] as any
    pokemonSvgUrl.value = candidate?.svgUrl ?? null
    pokeTypes.value = candidate?.data?.types?.map((t: any) => t.type?.name).filter(Boolean) ?? []
    pokeWeight.value = candidate?.data?.weight ?? null
    hintsReady.value = !!pokemonSvgUrl.value
  } else {
    pokeTypes.value = []
    pokeWeight.value = null
    hintsReady.value = false
  }

  return lastResults
}
watch(() => props.pokemonCard, async (val) => {
  if (val) {
    await refreshResults()
  }
}, { immediate: true })

defineExpose({ refreshResults, resultsStore })


function onPokeballAnimationEnd(e: AnimationEvent) {
  const target = (e.target || {}) as any
  if (target?.classList?.contains?.('pokeball-wrap')) {
    showCenterCircle.value = true
  }
}

function selectOption(opt: { id: number; name: string; isCorrect?: boolean }) {
  if (answered.value) {
    return
  }
  selectedId.value = opt.id
  answered.value = true

  emit('answerSelected', { id: opt.id, name: opt.name, isCorrect: !!opt.isCorrect } as any)
}


</script>

<template>
  <div :class="props.wrapperClass ?? 'w-full flex flex-col items-center gap-4'">

    <div
      :class="props.innerClass ?? 'w-full max-w-3xl bg-[linear-gradient(to_bottom,#dc2626_50%,#f97316_100%)] text-white p-6 shadow rounded-xl h-96 relative overflow-hidden'">
      <img src="/src/assets/quienEs.png" alt="Logo" class="h-48 md:h-auto w-48  block z-10" />

      <div class="absolute inset-0 pointer-events-none animated-lines" aria-hidden="true"></div>

      <div class="pokeball-wrap absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
        @animationend="onPokeballAnimationEnd">
        <img src="/src/assets/Pokebola-pokeball-png-0.png" alt="pokeball"
          class="w-48 h-48 md:w-64 md:h-64 z-20 pointer-events-none pokeball-spin" />
      </div>
      <div v-if="showCenterCircle"
        class="center-burst absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
        <div class="burst-outer" aria-hidden="true"></div>
        <div class="burst-inner" aria-hidden="true"></div>
        <div v-if="pokemonSvgUrl"
          class="pokemon-preview absolute z-30 w-48 h-48 flex items-center justify-center pointer-events-none">
          <img :src="pokemonSvgUrl" alt="pokemon"
            :class="['silhouette w-full h-full object-contain', answered ? 'revealed' : '']" />
        </div>
      </div>

    </div>

    <div :class="props.innerClass ?? 'bg-white/90 p-4 shadow rounded-lg w-100'">
      <slot name="clues" />
      <div class="mt-2 text-sm text-gray-700">
        <template v-if="hintsReady">
          <div class="flex justify-between text-center gap-4">
            <div class="flex-1"><strong>Tipo 1:</strong> {{ pokeTypes[0] ?? '—' }}</div>
            <div class="flex-1"><strong>Tipo 2:</strong> {{ pokeTypes[1] ?? '—' }}</div>
            <div class="flex-1"><strong>Peso:</strong> {{ displayWeight }}</div>
          </div>
        </template>
        <template v-else>
          <div class="text-gray-500 text-center">Cargando pistas…</div>
        </template>
      </div>
    </div>

    <div :class="props.innerClass ?? 'bg-white/90 p-4 shadow rounded-lg w-100'">
      <div class="text-sm font-medium mb-2">Elige una opción:</div>
      <div class="flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2">
          <BaseButton v-for="opt in optionsComputed" :key="opt.id" :disabled="answered" fullWidth
            @click="() => selectOption(opt)" :class="[
              'px-3 py-2 rounded font-semibold transition-transform duration-150',
              !answered ? 'hover:opacity-95 hover:scale-105' : 'opacity-60',

              answered && ((selectedIsCorrect && selectedId === opt.id) || (!selectedIsCorrect && opt.isCorrect)) ? 'ring-2 ring-green-500' : '',

              answered && selectedId === opt.id && !opt.isCorrect ? 'ring-2 ring-red-500' : ''
            ]">
            {{ opt.name }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="../styles/basecard.css"></style>
