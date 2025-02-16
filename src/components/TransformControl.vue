<template>
  <div class="ctrl-container no-print">
    <div v-show="element.id === selected" class="control" :style="controlStyle">
      <div class="rot-handle" @mousedown.stop.prevent="mousedownHandle($event, 'rotation')">
        <div class="rhandle" />
      </div>
      <div class="del-handle del" @click="removeElement" title="Delete"></div>
      <div
        class="ctr-handle lh"
        @mousedown.stop.prevent="mousedownHandle($event, 'left')"
        v-if="isText"
      >
        <div class="shandle" />
      </div>
      <div
        class="ctr-handle rh"
        @mousedown.stop.prevent="mousedownHandle($event, 'right')"
        v-if="isText"
      >
        <div class="shandle" />
      </div>
      <div
        class="cor-handle tr"
        @mousedown.stop.prevent="mousedownHandle($event, 'topright')"
        v-if="!isText"
      >
        <div class="chandle" />
      </div>
      <div
        class="cor-handle br"
        @mousedown.stop.prevent="mousedownHandle($event, 'bottomright')"
        v-if="!isText"
      >
        <div class="chandle" />
      </div>
      <div
        class="cor-handle tl"
        @mousedown.stop.prevent="mousedownHandle($event, 'topleft')"
        v-if="!isText"
      >
        <div class="chandle" />
      </div>
      <div
        class="cor-handle bl"
        @mousedown.stop.prevent="mousedownHandle($event, 'bottomleft')"
        v-if="!isText"
      >
        <div class="chandle" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, computed, onBeforeMount } from 'vue'
import { throttle } from '@/utility/util'

import { useStore } from '@/stores'
const store = useStore()

const data = reactive({
  mX: 0,
  mY: 0,
  eX: 0,
  eY: 0,
  w: 0,
  h: 0,
  angle: 0,
  type: '',
  throttleFun: () => {},
})

const element = computed(() => store.state.selectedElement)
const controlStyle = computed(() => {
  return {
    left: `${element.value.x}px`,
    top: `${element.value.y}px`,
    width: `${element.value.width}px`,
    height: `${element.value.height}px`,
    transform: `rotate(${element.value.rot}deg)`,
  }
})
const isText = computed(() => element.value.type === 'text')
const selected = computed(() => store.state.selected)

const mousemoveHandle = (e: MouseEvent) => {
  e.stopPropagation()
  e.preventDefault()
  const dx = e.pageX - data.mX
  const dy = e.pageY - data.mY
  if (data.type === 'right') {
    const width = data.w + dx
    store.updateProperties({ width: width })
  } else if (data.type === 'left') {
    const width = data.w - dx
    const x = data.eX + dx
    store.updateProperties({ width: width, x: x })
  } else if (data.type === 'topright') {
    store.updateProperties({
      width: data.w + dx,
      height: data.h - dy,
      y: data.eY + dy,
    })
  } else if (data.type === 'bottomright') {
    store.updateProperties({ width: data.w + dx, height: data.h + dy })
  } else if (data.type === 'topleft') {
    store.updateProperties({
      width: data.w - dx,
      height: data.h - dy,
      x: data.eX + dx,
      y: data.eY + dy,
    })
  } else if (data.type === 'bottomleft') {
    store.updateProperties({
      width: data.w - dx,
      height: data.h + dy,
      x: data.eX + dx,
    })
  } else if (data.type === 'rotation') {
    const center_x = data.eX + data.w / 2
    const center_y = data.eY + data.h / 2
    const mouse_x = e.pageX
    const mouse_y = e.pageY
    const radians = Math.atan2(mouse_x - center_x, mouse_y - center_y)
    const degree = radians * (180 / Math.PI) * -1 + 180
    store.updateProperties({ origin: 'center center', rot: degree })
  }
}
const removeElement = () => {
  store.setIsOpen(['', false])
  store.removeElement()
}
const mouseupHandle = () => {
  document.removeEventListener('mousemove', data.throttleFun, true)
  document.removeEventListener('mouseup', mouseupHandle, true)
  data.mX = 0
  data.mY = 0
  data.eX = 0
  data.eY = 0
  data.w = 0
  data.h = 0
  data.type = ''
}
const mousedownHandle = (e: { pageX: number; pageY: number }, side: string) => {
  data.mX = e.pageX
  data.mY = e.pageY
  data.eX = element.value.x
  data.eY = element.value.y
  data.w = element.value.width
  data.h = element.value.height
  data.angle = element.value.rot
  data.type = side
  document.addEventListener('mousemove', data.throttleFun, true)
  document.addEventListener('mouseup', mouseupHandle, true)
}
onBeforeMount(() => {
  data.throttleFun = throttle(mousemoveHandle as unknown as (...args: unknown[]) => unknown, 10)
})
</script>
