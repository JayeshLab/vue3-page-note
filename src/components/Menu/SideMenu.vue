<template>
  <div class="side_menu" :style="{ left: isOpen ? '0px' : '-250px' }">
    <div class="burger_box">
      <div class="menu-icon-container">
        <a
          href="#"
          class="menu-icon js-menu_toggle"
          :class="[isOpen ? 'opened' : 'closed']"
          @click="toggleMenu"
        >
          <span class="menu-icon_box">
            <span class="menu-icon_line menu-icon_line--1"></span>
            <span class="menu-icon_line menu-icon_line--2"></span>
            <span class="menu-icon_line menu-icon_line--3"></span>
          </span>
        </a>
      </div>
    </div>
    <div class="container">
      <div class="menu_title">
        <img height="28px" width="28px" src="@/assets/icon.png" /> Vue Page Note
      </div>
      <button class="vn-btn full-width" @click="addNewPage">Add New Page</button>
      <ul class="page-list">
        <li
          class="page-item"
          v-for="page in pages"
          :key="page.pid"
          @click="selectPage(page.pid)"
          :class="{ active: currentPage ? currentPage.pid == page.pid : false }"
        >
          <EditableTitle :page="page" :pid="page.pid"></EditableTitle>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import EditableTitle from '@/components/Menu/EditableTitle.vue'
import { ref, computed } from 'vue'
import { useStore } from '@/stores'

const isOpen = ref(false)
const store = useStore()
const pages = computed(() => store.state.pages)
const currentPage = computed(() => store.state.currentPage)
const addNewPage = () => {
  store.addNewPage()
}
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
const selectPage = (pageId: string) => {
  store.selectPage(pageId)
}
</script>
