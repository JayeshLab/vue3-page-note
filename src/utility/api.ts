const PAGES_KEY = 'vpn-pages'
const CURRENT_PAGE_ID = 'vpn-cpi'

import type { Page } from '@/types'
import { createDefaultPage, debounce } from './util'
const api = {
  loadPages: () => {
    const pageIds = JSON.parse(localStorage.getItem(PAGES_KEY) ?? '[]') || []
    const currentPageId: string = localStorage.getItem(CURRENT_PAGE_ID) ?? '0'
    let currentPage = null
    const pages = []
    if (pageIds.length > 0) {
      pageIds.forEach((id: string) => {
        const page = JSON.parse(localStorage.getItem(id) ?? '{}')
        pages.push(page)
        if (id === currentPageId) {
          currentPage = page
        }
      })
    } else {
      const pg = createDefaultPage({})
      const newPid = pg.pid
      pageIds.push(newPid)
      localStorage.setItem(PAGES_KEY, JSON.stringify(pageIds))
      localStorage.setItem(CURRENT_PAGE_ID, newPid)
      localStorage.setItem(newPid, JSON.stringify(pg))
      pages.push(pg)
      currentPage = pg
    }
    return { pages, currentPage }
  },
  createNewPage: () => {
    const pageIds = JSON.parse(localStorage.getItem(PAGES_KEY) ?? '[]') || []
    const page: Page = createDefaultPage({})
    const newPid = page.pid
    pageIds.push(newPid)
    localStorage.setItem(PAGES_KEY, JSON.stringify(pageIds))
    localStorage.setItem(CURRENT_PAGE_ID, newPid)
    localStorage.setItem(newPid, JSON.stringify(page))
    return page
  },
  setCurrentPageId: (pageId: string) => {
    localStorage.setItem(CURRENT_PAGE_ID, pageId)
  },
  setPage: (page: Page) => {
    localStorage.setItem(page.pid, JSON.stringify(page))
  },
  saveFonts: (fonts: string[]) => {
    localStorage.setItem('gfonts', JSON.stringify(fonts))
  },
  getFonts: () => {
    const localFonts = localStorage.getItem('gfonts') || '[]'
    const fonts =
      localFonts && localFonts !== '[]'
        ? JSON.parse(localFonts)
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
    console.log('fonts', fonts)
    return fonts
  },
  savePage: debounce(
    (page: unknown) => {
      api.setPage(page as Page)
    },
    3000,
    false,
  ),
}
export default api
