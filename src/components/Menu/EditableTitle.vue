<template>
  <div class="d-flex">
    <div class="page-title" v-if="!(store.state.titleEdit === pid)" @dblclick="editTitle">
      <div class="page-title-text">{{ page.title }}</div>
      <div class="title-btn edit-title" @click="editTitle"></div>
      <div class="title-btn delete-title" @click="deletePage"></div>
    </div>
    <div class="page-title" v-else>
      <input class="page-title-input" type="text" v-model="pageTitle" />
      <div class="title-btn cancel-title" @click="cancelTitle"></div>
      <div class="title-btn save-title" @click="updateTitle"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Page } from '@/types'
import { ref, watch } from 'vue'
import { useStore } from '@/stores'

const props = defineProps<{
  page: Page
  pid: string
}>()
const store = useStore()
const pageTitle = ref('')

watch(
  () => props.pid,
  (newval) => {
    if (newval !== props.page.pid) {
      store.state.titleEdit = ''
    }
  },
)
const cancelTitle = () => {
  store.state.titleEdit = ''
}
const editTitle = () => {
  store.state.titleEdit = props.pid
  pageTitle.value = props.page.title.slice()
}

const updateTitle = () => {
  store.state.titleEdit = ''
  store.updatePageTitle(pageTitle.value)
  pageTitle.value = ''
}
const deletePage = () => {
  store.state.titleEdit = ''
  if (confirm('Are you sure you want to delete the page ' + props.page.title + ' ?') == true) {
    store.deletePage(props.page.pid)
    pageTitle.value = ''
  }
}
</script>
