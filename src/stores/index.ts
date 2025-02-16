import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '../utility/api'
import uid from '../utility/uid'
import { createDefaultElement } from '../utility/util'
import type { Element, EmptyObject, Page, PageElements } from '@/types'

export const useStore = defineStore('store', () => {
  const state = reactive({
    pages: [] as Page[],
    currentPage: {} as Page,
    selectedPageElements: {} as PageElements,
    selectedElement: {} as Element | EmptyObject,
    selected: '',
    editable: '',
    formatEvent: ['color', '#000000'] as [string, string],
    isOpen: '',
    fonts: api.getFonts() as string[],
  })

  const getElement = computed(() => (id: string) => {
    return state.selectedPageElements[id]
  })
  const getOpenState = computed(() => (id: string) => {
    return state.isOpen === id
  })
  function initializeStore() {
    const { pages, currentPage } = api.loadPages()
    if (currentPage) {
      state.currentPage = currentPage
      state.selectedPageElements = currentPage.elements
    }
    state.pages = pages
  }
  function unSelectElement() {
    state.selected = ''
    state.editable = ''
  }
  function addNewPage() {
    unSelectElement()
    const page = api.createNewPage()
    state.currentPage = page
    state.selectedPageElements = state.pages[0].elements
    state.pages.push(page)
  }
  function selectPage(payload: string) {
    unSelectElement()
    api.setCurrentPageId(payload)
    const page = state.pages.find((page) => page.pid === payload)
    if (page) {
      state.currentPage = page
      state.selectedPageElements = page.elements
    }
  }
  function selectElement(payload: { id: string; h: number; w: number }) {
    state.editable = ''
    state.selected = payload.id
    const element = Object.assign(state.selectedPageElements[payload.id], {
      height: payload.h,
      width: payload.w,
    })
    state.selectedElement = element
  }
  function moveElement(payload: { x: number; y: number }) {
    if ('x' in state.selectedElement && 'y' in state.selectedElement) {
      state.selectedElement.x = payload.x
      state.selectedElement.y = payload.y
    }
  }
  function pageSelected() {
    state.editable = ''
    state.selected = ''
    state.selectedElement = {}
  }

  function updateProperties(payload: Partial<Element>) {
    state.selectedElement = Object.assign(state.selectedElement, payload)
  }
  function setEditable(payload: string) {
    state.editable = payload
  }
  function updateHtmlText(payload: {
    txt: string | undefined
    h: number | undefined
    w: number | undefined
  }) {
    if (
      'content' in state.selectedElement &&
      'height' in state.selectedElement &&
      'width' in state.selectedElement
    ) {
      if (payload.txt !== undefined) {
        state.selectedElement.content = payload.txt
      }
      if (payload.h !== undefined) {
        state.selectedElement.height = payload.h
      }
      if (payload.w !== undefined) {
        state.selectedElement.width = payload.w
      }
    }
  }
  function setFormatEvent(payload: [string, string]) {
    state.formatEvent = payload
  }
  function clearPage() {
    for (const ele in state.selectedPageElements) {
      delete state.selectedPageElements[ele]
    }
    api.setPage(state.currentPage)
  }
  function deletePage(payload: string) {
    unSelectElement()
    const pgs = state.pages.filter((page) => page.pid !== payload)
    if (pgs.length > 0) {
      state.currentPage = pgs[0]
      state.selectedPageElements = pgs[0].elements
      state.pages = pgs
    } else {
      const pg = api.createNewPage()
      state.currentPage = pg
      state.selectedPageElements = pg.elements
      state.pages.push(pg)
    }
  }
  function updatePageTitle(payload: string) {
    state.currentPage.title = payload
  }
  function addTextElement(type: string) {
    const id = `EL_${uid(32)}`
    const size = Object.keys(state.selectedPageElements).length
    const element = createDefaultElement({
      id: id,
      type: type,
      z: size + 1,
    })
    state.selectedPageElements[id] = element
  }
  function addImageElement(payload: { image: string; height: number; width: number }) {
    const id = `EL_${uid(32)}`
    const size = Object.keys(state.selectedPageElements).length
    const element = createDefaultElement({
      id: id,
      type: 'ImageElement',
      content: payload.image,
      z: size + 1,
      height: payload.height,
      width: payload.width,
    })
    state.selectedPageElements[id] = element
  }
  function delFont(payload: string) {
    const index = state.fonts.indexOf(payload)
    if (index > -1) {
      state.fonts.splice(index, 1)
    }
  }
  function removeElement() {
    const selectedId = state.selectedElement.id
    state.selected = ''
    state.editable = ''
    state.selectedElement = {}
    delete state.selectedPageElements[selectedId]
  }
  function setIsOpen(payload: [string, boolean]) {
    state.isOpen = payload[1] ? payload[0] : ''
  }
  function onPositionChange() {
    api.savePage(state.currentPage)
  }
  return {
    state,
    getElement,
    getOpenState,
    initializeStore,
    addNewPage,
    selectPage,
    deletePage,
    updatePageTitle,
    addTextElement,
    addImageElement,
    delFont,
    removeElement,
    setIsOpen,
    pageSelected,
    updateProperties,
    selectElement,
    moveElement,
    onPositionChange,
    setEditable,
    updateHtmlText,
    setFormatEvent,
    clearPage,
  }
})
