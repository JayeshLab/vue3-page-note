<template>
  <div class="d-flex">
    <div class="page-title" v-if="!isEdit" @dblclick="editTitle">
      {{ page.title }}
      <div class="title-btn edit-title" @click="editTitle"></div>
    </div>
    <div class="page-title" v-else>
      <input class="page-title-input" type="text" v-model="pageTitle" />
      <div class="title-btn save-title" @click="updateTitle"></div>
    </div>
    <div class="title-btn delete-title" @click="deletePage"></div>
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
const isEdit = ref(false)

watch(
  () => props.pid,
  (newval) => {
    if (newval !== props.page.pid) {
      isEdit.value = false
    }
  },
)
const editTitle = () => {
  isEdit.value = true
  pageTitle.value = props.page.title.slice()
}

const updateTitle = () => {
  isEdit.value = false
  store.updatePageTitle(pageTitle.value)
  pageTitle.value = ''
}
const deletePage = () => {
  isEdit.value = false
  if (confirm('Are you sure you want to delete the page ' + props.page.title + ' ?') == true) {
    store.deletePage(props.page.pid)
    pageTitle.value = ''
  }
}
</script>
