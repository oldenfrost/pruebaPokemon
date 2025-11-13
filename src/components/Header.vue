<script setup lang="ts">
const props = defineProps<{
  classImage?: string
}>()
</script>

<template>
  <header class="w-full h py-4 flex justify-center items-center">
    <div class="relative inline-block">
      <img src="/src/assets/logo.png" alt="Logo" :class="props.classImage ?? 'h-12 md:h-auto w-auto block'" />
    </div>
  </header>
</template>
