<template>
  <img
    ref="imgRef"
    :src="item.content"
    class="image-element"
    :style="styleObj"
    @mousedown="mousedownHandle"
    draggable="true"
  />
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useControl } from '@/composables/useControl'
const { eid } = defineProps<{ eid: string }>()
const imgRef = useTemplateRef('imgRef')
const { item, styleObj, mousedownHandle } = useControl(eid)
</script>
