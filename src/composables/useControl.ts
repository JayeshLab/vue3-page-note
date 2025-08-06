import { ref, reactive, computed } from 'vue'
import { useStore } from '@/stores'

export function useControl(eid: string) {
  const store = useStore()
  const cdata = reactive({
    mX: 0,
    mY: 0,
    eX: 0,
    eY: 0,
  })
  const isDragging = ref(false)
  const item = store.getElement(eid)

  const selected = computed(() => {
    return store.state.selected
  })
  const editable = computed(() => {
    return store.state.editable
  })
  const isContentEditable = computed(() => {
    return item.id === store.state.editable
  })
  const isImage = computed(() => {
    return item.type === 'Image'
  })

  const styleObj = computed(() => {
    const style = {
      width: `${item.width}px`,
      transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rot}deg)`,
      zIndex: item.z,
      cursor: isContentEditable.value ? 'auto' : 'move',
      ...(isImage.value && { height: `${item.height}px` }),
    }
    return style
  })

  const mousemoveHandle = (e: MouseEvent) => {
    e.preventDefault()
    const dx = e.pageX - cdata.mX
    const dy = e.pageY - cdata.mY
    isDragging.value = true
    requestAnimationFrame(() => {
      store.moveElement({ x: cdata.eX + dx, y: cdata.eY + dy })
    })
  }

  const parentTagActive = (elem: HTMLElement | null): boolean => {
    if (!elem || !elem.classList || elem.classList.contains('editbox')) return false
    return elem.parentNode instanceof HTMLElement ? parentTagActive(elem.parentNode) : false
  }
  const selectionHandle = () => {
    const selection = window.getSelection()
    if (selection && selection.anchorNode?.parentNode) {
      parentTagActive(selection.anchorNode.parentNode?.parentElement)
    }
    window.removeEventListener('mouseup', selectionHandle, true)
  }
  const mouseupHandle = (e: MouseEvent) => {
    e.preventDefault()
    store.onPositionChange()
    window.removeEventListener('mousemove', mousemoveHandle, true)
    window.removeEventListener('mouseup', mouseupHandle, true)
    isDragging.value = false
  }
  const getSelectedText = () => {
    const selectedText = window.getSelection()
    const docSelection = document.getSelection()
    if (selectedText) {
      return selectedText.toString()
    } else if (docSelection) {
      return docSelection.toString()
    }
    return ''
  }
  const onTouchMove = (e: TouchEvent) => {
    console.log('Touch Move')
    if (e.touches.length === 1) {
      const touch = e.touches[0]
      const dx = touch.pageX - cdata.mX
      const dy = touch.pageY - cdata.mY
      requestAnimationFrame(() => {
        store.moveElement({ x: cdata.eX + dx, y: cdata.eY + dy })
      })
    }
  }

  const onTouchEnd = () => {
    console.log('Touch End')
    store.onPositionChange()
    window.removeEventListener('touchmove', onTouchMove, true)
    window.removeEventListener('touchend', onTouchEnd, true)
    window.removeEventListener('touchcancel', onTouchEnd, true)
  }

  const touchStartHandle = (e: TouchEvent) => {
    console.log('Touch Start')
    if (item.lock) return
    if (e.touches.length === 1) {
      isDragging.value = true
      const touch = e.touches[0]
      const el = e.currentTarget as HTMLElement
      cdata.mX = touch.pageX
      cdata.mY = touch.pageY
      cdata.eX = item.x
      cdata.eY = item.y
      store.selectElement({ id: item.id, h: el.clientHeight, w: el.clientWidth })
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', onTouchEnd)
      window.addEventListener('touchcancel', onTouchEnd)
    }
  }
  const mousedownHandle = (e: MouseEvent) => {
    if (e instanceof MouseEvent && e.button !== 0) return
    if (editable.value != item.id) {
      const el = e.currentTarget as HTMLElement
      cdata.mX = e.pageX
      cdata.mY = e.pageY
      cdata.eX = item.x
      cdata.eY = item.y
      store.selectElement({ id: item.id, h: el.clientHeight, w: el.clientWidth })
      if (item.lock) return
      window.addEventListener('mousemove', mousemoveHandle, true)
      window.addEventListener('mouseup', mouseupHandle, true)
    } else {
      window.addEventListener('mouseup', selectionHandle, true)
    }
  }
  return {
    item,
    styleObj,
    selected,
    editable,
    isContentEditable,
    isImage,
    mousedownHandle,
    touchStartHandle,
    getSelectedText,
  }
}
