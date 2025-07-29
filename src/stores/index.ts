import { reactive, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import api from '../utility/api'
import uid from '../utility/uid'
import { createDefaultElement, getLayerList } from '../utility/util'
import type { Element, EmptyObject, Page, PageElements } from '@/types'

export const useStore = defineStore('store', () => {
  const state = reactive({
    pages: [] as Page[],
    currentPage: {} as Page | null,
    layers: [] as string[],
    selectedPageElements: {} as PageElements,
    selectedElement: {} as Element | EmptyObject,
    selected: '',
    editable: '',
    formatEvent: ['color', '#000000'] as [string, string],
    isOpen: '',
    fonts: [] as string[],
    titleEdit: '',
  })
  const getElement = computed(() => (id: string) => {
    return state.selectedPageElements[id]
  })
  const getOpenState = computed(() => (id: string) => {
    return state.isOpen === id
  })

  async function initializeStore() {
    const { pages, currentPage, layers } = await api.loadPages()
    const newState = {}
    const fonts = await api.getFonts()
    if (fonts) {
      Object.assign(newState, { fonts })
    }
    if (currentPage) {
      Object.assign(newState, {
        currentPage: currentPage,
        selectedPageElements: currentPage.elements,
        layers: layers,
      })
    }
    Object.assign(newState, { pages: pages })
    Object.assign(state, newState)
  }
  function unSelectElement() {
    return { selected: '', editable: '', selectedElement: {} }
  }
  function selectElement(payload: { id: string; h: number; w: number }) {
    const element = Object.assign(state.selectedPageElements[payload.id], {
      height: payload.h,
      width: payload.w,
    })
    Object.assign(state, { editable: '', selected: payload.id, selectedElement: element })
  }
  function moveElement(payload: { x: number; y: number }) {
    if ('x' in state.selectedElement && 'y' in state.selectedElement) {
      Object.assign(state.selectedElement, { x: payload.x, y: payload.y })
    }
  }
  function addTextElement(type: string) {
    const id = `EL_${uid(32)}`
    const size = Object.keys(state.layers).length
    const element = createDefaultElement({
      id: id,
      type: type,
      z: size + 1,
    })
    state.layers.push(element.id)
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
  function removeElement() {
    const selectedId = state.selectedElement.id
    Object.assign(state, { selected: '', editable: '', selectElement: {} })
    delete state.selectedPageElements[selectedId]
  }
  async function selectPage(payload: string) {
    await api.setCurrentPageId(payload)
    const page = state.pages.find((page) => page.pid === payload)
    if (page) {
      Object.assign(state, {
        ...unSelectElement(),
        currentPage: page,
        selectedPageElements: page.elements,
        layers: getLayerList(page.elements),
      })
    }
  }
  async function addNewPage() {
    const page = await api.createNewPage()
    const pages = [...state.pages]
    pages.push(page)
    await api.setCurrentPageId(page.pid)
    Object.assign(state, {
      ...unSelectElement(),
      currentPage: page,
      selectedPageElements: page.elements,
      pages: pages,
    })
    await selectPage(page.pid)
  }
  async function clearPage() {
    for (const ele in state.selectedPageElements) {
      delete state.selectedPageElements[ele]
    }
    if (state.currentPage) {
      await api.setPage(state.currentPage)
    }
  }
  async function deletePage(payload: string) {
    const newState = {}
    // Filter other pages
    const pgs = state.pages.filter((page) => page.pid !== payload)
    if (pgs.length > 0) {
      Object.assign(newState, {
        currentPage: pgs[0],
        selectedPageElements: pgs[0].elements,
        pages: pgs,
        layers: getLayerList(pgs[0].elements),
        ...unSelectElement(),
      })
    } else {
      const pg = await api.createNewPage()
      const pages = [...state.pages]
      pages.push(pg)
      Object.assign(newState, {
        currentPage: pg,
        selectedPageElements: pg.elements,
        pages: pages,
        layers: getLayerList(pg.elements),
        ...unSelectElement(),
      })
    }
    await api.deletePage(payload)
    Object.assign(state, newState)
    if (state.currentPage) {
      api.savePage(state.currentPage)
    }
  }
  function pageSelected() {
    Object.assign(state, unSelectElement())
  }
  function addFont(fontName: string) {
    state.fonts.push(fontName)
  }
  function delFont(payload: string) {
    const index = state.fonts.indexOf(payload)
    if (index > -1) {
      state.fonts.splice(index, 1)
    }
  }
  function updateLayer(action: string) {
    if (state.selectedElement) {
      const elemId = state.selectedElement.id
      const currentIdx = state.layers.indexOf(elemId)
      const currentZ = state.selectedElement.z
      const maxIndex = state.layers.length - 1
      switch (action) {
        case 'bringforward':
          if (currentIdx !== maxIndex) {
            const swapElId = state.layers[currentIdx + 1]
            const swapEl = state.currentPage?.elements[swapElId]
            if (swapEl) {
              const swapZ = swapEl?.z
              swapEl.z = currentZ
              state.selectedElement.z = swapZ
            }
          }
          break
        case 'sendbackward':
          if (currentIdx !== 0) {
            const swapElId = state.layers[currentIdx - 1]
            const swapEl = state.currentPage?.elements[swapElId]
            if (swapEl) {
              const swapZ = swapEl?.z
              swapEl.z = currentZ
              state.selectedElement.z = swapZ
            }
          }
          break
        case 'bringfront':
          if (currentIdx !== maxIndex) {
            const swapElId = state.layers[maxIndex]
            const swapEl = state.currentPage?.elements[swapElId]
            if (swapEl) {
              const swapZ = swapEl?.z
              swapEl.z = currentZ
              state.selectedElement.z = swapZ
            }
          }
          break
        case 'sendback':
          if (currentIdx !== 0) {
            const swapElId = state.layers[0]
            const swapEl = state.currentPage?.elements[swapElId]
            if (swapEl) {
              const swapZ = swapEl?.z
              swapEl.z = currentZ
              state.selectedElement.z = swapZ
            }
          }
          break
      }
      if (state.currentPage) {
        state.layers = getLayerList(state.currentPage.elements)
      }
    }
  }
  function updateProperties(payload: Partial<Element>) {
    state.selectedElement = Object.assign(state.selectedElement, payload)
  }
  function setEditable(payload: string) {
    state.editable = payload
  }
  function setIsOpen(payload: [string, boolean]) {
    state.isOpen = payload[1] ? payload[0] : ''
  }
  function onPositionChange() {
    if (state.currentPage) {
      api.savePage(state.currentPage as Page)
    }
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
      const ele = {}
      if (payload.txt !== undefined) {
        Object.assign(ele, { content: payload.txt })
      }
      if (payload.h !== undefined) {
        Object.assign(ele, { height: payload.h })
      }
      if (payload.w !== undefined) {
        Object.assign(ele, { width: payload.w })
      }
      Object.assign(state.selectedElement, ele)
    }
  }
  function setFormatEvent(payload: [string, string]) {
    state.formatEvent = payload
  }

  function updatePageTitle(payload: string) {
    if (state.currentPage) {
      state.currentPage.title = payload
    }
  }

  watch(
    () => state.fonts,
    (newFonts) => {
      api.saveFonts(newFonts)
    },
    { deep: true },
  )
  watch(
    [() => state.selectedPageElements, () => state.selectedElement, () => state.currentPage?.title],
    () => {
      if (state.currentPage) {
        api.savePage(state.currentPage)
      }
    },
    { deep: true },
  )

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
    clearPage,
    addFont,
    setFormatEvent,
    updateLayer,
  }
})
