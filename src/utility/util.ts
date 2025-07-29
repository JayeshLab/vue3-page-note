import type { Element, Page } from '@/types'
import uid from './uid'

const createDefaultElement = (prop: Partial<Element> = {}): Element => {
  return Object.assign(
    {
      id: '',
      type: '',
      x: Math.floor(Math.random() * 300 + 200),
      y: Math.floor(Math.random() * 300 + 150),
      z: 0,
      rot: 0,
      height: 50,
      width: 300,
      content: 'Default Text',
    } as Element,
    prop,
  )
}
const createDefaultPage = (prop: Partial<Page>): Page => {
  const defaultElement: Record<string, Element> = {}
  const id = `EL_${uid(32)}`
  defaultElement[id] = createDefaultElement({ id: id, type: 'TextElement' })
  const defaultPage: Page = {
    pid: `PG_${uid(32)}`,
    icon: '📝',
    title: 'Untitled',
    elements: defaultElement,
    last_saved: new Date().toLocaleDateString(),
  } as Page

  return Object.assign(defaultPage, prop)
}
const getLayerList = (elements: Record<string, Element>): string[] => {
  const clonedList = [...Object.values(elements)]
  const sortedList = clonedList.sort((a, b) => a.z - b.z).map((m) => m.id)
  return sortedList
}
function debounce<Params extends unknown[]>(
  func: (...args: Params) => unknown,
  timeout: number,
): (...args: Params) => void {
  let timer: number | null
  return (...args: Params) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, timeout)
  }
}
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return function (...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastCall < delay) {
      return
    }
    lastCall = now
    return fn(...args)
  }
}
export { createDefaultElement, createDefaultPage, getLayerList, debounce, throttle }
