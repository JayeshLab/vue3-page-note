<template>
  <div
    ref="txtRef"
    :contenteditable="isContentEditable"
    class="editbox"
    @click.stop.prevent="onClick"
    @mousedown="mousedownHandle"
    :style="styleObj"
    @blur="onSelect"
    @input="updateText"
    v-html="htext"
  ></div>
</template>
<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue'
import { useStore } from '@/stores'
import { useControl } from '@/composables/useControl'

const emit = defineEmits(['txtEvent'])
const { eid } = defineProps<{ eid: string }>()
const htext = ref('')
const txtRef = useTemplateRef('txtRef')
const { item, isContentEditable, styleObj, mousedownHandle } = useControl(eid)
const store = useStore()
onMounted(() => {
  htext.value = item.content
})
const onClick = () => {
  store.setEditable(item.id)
  onSelect()
}
const updateText = () => {
  const strHtml = txtRef.value?.innerHTML
  store.updateHtmlText({
    txt: strHtml,
    h: txtRef.value?.clientHeight,
    w: txtRef.value?.clientWidth,
  })
}
const onSelect = () => {
  emit('txtEvent')
}
</script>
