<template>
  <div
    class="popover-box"
    :style="{ width: `${width}px`, 'min-height': `${height}px`, left: `-${width / 2 - 12}px` }"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
const { width, height } = defineProps<{ width: number; height: number }>()
</script>
