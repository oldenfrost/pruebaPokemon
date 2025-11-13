<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{
  fullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  bgColor?: string
  textColor?: string
  rounded?: string
}>()

const emit = defineEmits(['click'])
const roundedClass = props.rounded ?? 'rounded-3xl'
const defaultBg = props.bgColor ?? 'bg-[#FFDE00]'
const disabledBg = 'bg-[#FFE99D]'
const defaultText = props.textColor ?? 'text-[#1B1B1F]'

const classes = computed(() => {
  const bgColorClass = props.disabled ? disabledBg : defaultBg
  const textColorClass = defaultText
  return [
    props.fullWidth ? 'w-full' : '',
    'px-4 py-2 text-lg font-bold',
    roundedClass,
    bgColorClass,
    textColorClass,
    props.disabled ? 'opacity-90 cursor-not-allowed' : 'cursor-pointer hover:shadow-sm',
  ].filter(Boolean).join(' ')
})


function onClick(e: MouseEvent) {
  if (props.disabled) return
  emit('click', e)
}
</script>

<template>
  <button :type="props.type ?? 'button'" :disabled="props.disabled" :class="classes" @click="onClick">
    <slot />
  </button>
</template>
