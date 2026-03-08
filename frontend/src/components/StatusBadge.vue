<template>
  <span :class="running ? 'text-blue-500 font-semibold' : 'text-pink-500 font-semibold'">
    {{ running ? 'Running' : 'Stopped' }}
  </span>
</template>

<script setup>
defineProps({
  running: Boolean,
});
</script>
