const PAGES_KEY = 'vpn-pages'
const CURRENT_PAGE_ID = 'vpn-cpi'

import type { Page } from '@/types'
import localForage from 'localforage'
import { createDefaultPage, debounce, getLayerList } from './util'
localForage.config({
  driver: localForage.INDEXEDDB,
  name: 'vpn',
})
const api = {
  loadPages: async () => {
    const pageIds = JSON.parse((await localForage.getItem(PAGES_KEY)) ?? '[]') || []
    const currentPageId: string = (await localForage.getItem(CURRENT_PAGE_ID)) ?? '0'
    let currentPage = null
    let layers: string[] = []
    const pages = []
    if (pageIds.length > 0) {
      for (const pageId of pageIds) {
        const page = (await localForage.getItem(pageId)) as string
        const pg: Page = page ? JSON.parse(page) : {}
        pages.push(pg)
        if (pageId === currentPageId) {
          currentPage = pg
          layers = getLayerList(pg.elements)
        }
      }
    } else {
      const pg: Page = createDefaultPage({})
      const newPid = pg.pid
      pageIds.push(newPid)
      await localForage.setItem(PAGES_KEY, JSON.stringify(pageIds))
      await localForage.setItem(CURRENT_PAGE_ID, newPid)
      await localForage.setItem(newPid, JSON.stringify(pg))
      pages.push(pg)
      currentPage = pg
      layers = getLayerList(pg.elements)
    }
    return { pages, currentPage, layers }
  },

  createNewPage: async () => {
    const pageIds = JSON.parse((await localForage.getItem(PAGES_KEY)) ?? '[]') || []
    const page: Page = createDefaultPage({})
    const newPid = page.pid
    pageIds.push(newPid)
    await localForage.setItem(PAGES_KEY, JSON.stringify(pageIds))
    await localForage.setItem(CURRENT_PAGE_ID, newPid)
    await localForage.setItem(newPid, JSON.stringify(page))
    return page
  },

  setCurrentPageId: async (pageId: string) => {
    await localForage.setItem(CURRENT_PAGE_ID, pageId)
  },

  setPage: async (page: Page) => {
    await localForage.setItem(page.pid, JSON.stringify(page))
  },
  deletePage: async (pageId: string) => {
    const ids = JSON.parse((await localForage.getItem(PAGES_KEY)) ?? '[]') || []
    const pageIds = ids.filter((e: string) => e !== pageId)
    await localForage.setItem(PAGES_KEY, JSON.stringify(pageIds))
    await localForage.removeItem(pageId)
  },
  saveFonts: async (fonts: string[]) => {
    await localForage.setItem('gfonts', JSON.stringify(fonts))
  },

  getFonts: async () => {
    const localFonts = (await localForage.getItem('gfonts')) || '[]'
    const fonts =
      localFonts && localFonts !== '[]'
        ? JSON.parse(localFonts.toString())
        : [
            'Aladin',
            'Kumar One Outline',
            'Fredericka the Great',
            'Indie Flower',
            'Pacifico',
            'Courier Prime',
            'Poppins',
            'Kaushan Script',
          ]
    return fonts
  },

  savePage: debounce(async (page: Page) => {
    await api.setPage(page as Page)
    await api.setCurrentPageId(page.pid)
  }, 3000),
}
export default api
