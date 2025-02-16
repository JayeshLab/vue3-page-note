<template>
  <SideMenu />
  <PageNote />
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import SideMenu from '@/components/Menu/SideMenu.vue'
import PageNote from '@/components/PageNote.vue'
import WebFontLoader from 'webfontloader'
import { useStore } from '@/stores'
const store = useStore()
const onFontLoaded = () => {
  console.log('Fonts loaded')
}
onMounted(() => {
  store.initializeStore()
  WebFontLoader.load({
    google: {
      families: store.state.fonts,
    },
    active: onFontLoaded,
  })
})
</script>
