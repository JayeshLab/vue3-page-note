<template>
  <div v-show="isActive" class="emoji-group tab-pane">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  selected: string
}>()
const isActive = computed(() => props.title === props.selected)
</script>
