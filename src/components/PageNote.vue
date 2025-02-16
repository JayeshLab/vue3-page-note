<template>
  <div class="page" @click="pageClick" ref="root">
    <toolbar-menu></toolbar-menu>
    <div class="screen">
      <component
        :is="element.type"
        v-for="element in selectedPageElements"
        :key="element.id"
        :eid="element.id"
        @txtEvent="editboxSelect"
      ></component>
    </div>
    <transform-control></transform-control>
  </div>
</template>
<script setup lang="ts">
import ToolbarMenu from '@/components/Menu/ToolbarMenu.vue'
import TransformControl from '@/components/TransformControl.vue'
import { ref, watch, useTemplateRef, nextTick, computed } from 'vue'
import { useStore } from '@/stores'

const store = useStore()
const root = useTemplateRef('root')
const range = ref<Range | null>(null)
const selectedPageElements = computed(() => store.state.selectedPageElements)
const formatEvent = computed(() => store.state.formatEvent)
const editboxSelect = () => {
  const selection: Selection | null = window.getSelection()
  range.value = selection && selection.getRangeAt(0)
}
const pageClick = (e: MouseEvent) => {
  const el = e.target as HTMLInputElement
  if (el.classList.contains('page')) {
    root.value?.focus()
    range.value = null
    store.setIsOpen(['', false])
    store.pageSelected()
  }
  return false
}
watch(formatEvent, async (val) => {
  const selection: Selection | null = window.getSelection()
  if (selection && selection.rangeCount > 0 && range.value) {
    selection.removeAllRanges()
    selection.addRange(range.value)
    await nextTick()
    document.execCommand(val[0], false, val[1])
  }
})
</script>
