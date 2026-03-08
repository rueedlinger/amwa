<template>
  <button
    :disabled="loading"
    @click="$emit('click')"
    :class="[
      baseClass,
      running
        ? 'bg-gradient-to-r from-red-500 to-pink-500'
        : 'bg-gradient-to-r from-purple-500 to-blue-400',
    ]"
  >
    <div
      v-if="loading"
      class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
    />

    <span v-else>
      {{ running ? stopText : startText }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  running: Boolean,
  loading: Boolean,
  startText: String,
  stopText: String,
});

const baseClass =
  'px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center space-x-2 transition-all duration-300';
</script>
