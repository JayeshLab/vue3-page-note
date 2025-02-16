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
const debounce = (func: (...args: unknown[]) => void, wait: number, immediate: boolean) => {
  let timeout: number | null
  return function (context: unknown, ...args: unknown[]) {
    const later = function () {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    const callNow = immediate && !timeout
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
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
export { createDefaultElement, createDefaultPage, debounce, throttle }
