<template>
  <img
    ref="imgRef"
    :src="item.content"
    class="image-element"
    :style="styleObj"
    @mousedown="mousedownHandle"
    @dragstart.prevent
  />
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useControl } from '@/composables/useControl'
const { eid } = defineProps<{ eid: string }>()
const imgRef = useTemplateRef('imgRef')
const { item, styleObj, mousedownHandle } = useControl(eid)
</script>
