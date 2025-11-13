<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  label?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: string): void }>()

const value = computed<string>({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v)
})
</script>

<template>
  <div class="w-full mt-8">
    <label class="block text-left text-lg text-[#1B1B1F] mb-2 px-2">
      Usuario
    </label>

    <input v-model="value" :placeholder="props.placeholder || ''"
      class="w-full px-4 py-4 rounded-3xl bg-[#F1F1F1] border border-[#1B1B1F] text-[#1B1B1F] placeholder-[#A3A3A8]"
      type="text" />
  </div>
</template>


text-white/80