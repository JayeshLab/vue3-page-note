<template>
  <li class="dropdown">
    <button @click="show = !show" v-tooltip="`${tip}`">
      <i class="material-icons">{{ icon }}</i>
    </button>
    <PopOver :width="210" :height="210" v-show="show">
      <div class="color-content">
        <a
          class="pallet"
          v-for="(value, index) in colors"
          :key="`c-${index}`"
          @click.stop.prevent="selectColor(value)"
          :style="{ background: value }"
        ></a>
      </div>
    </PopOver>
  </li>
</template>
<script setup lang="ts">
import colors from '@/utility/colors'
import PopOver from '@/components/Menu/PopOver.vue'
import { computed } from 'vue'
import { useStore } from '@/stores'
const store = useStore()

const props = defineProps<{
  type: string
  icon: string
  tip: string
}>()

const show = computed({
  get: () => store.getOpenState(props.type),
  set: (val) => store.setIsOpen([props.type, val]),
})
const selectColor = (clr: string) => {
  store.setFormatEvent([props.type, clr])
}
</script>
