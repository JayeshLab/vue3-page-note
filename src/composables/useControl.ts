import { reactive, computed } from 'vue'
import { useStore } from '@/stores'

export function useControl(eid: string) {
  const store = useStore()
  const cdata = reactive({
    isMove: false,
    mX: 0,
    mY: 0,
    eX: 0,
    eY: 0,
  })
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
    cdata.isMove = true
    e.stopPropagation()
    e.preventDefault()
    const dx = e.pageX - cdata.mX
    const dy = e.pageY - cdata.mY
    store.moveElement({ x: cdata.eX + dx, y: cdata.eY + dy })
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

    document.removeEventListener('mouseup', selectionHandle, true)
  }
  const mouseupHandle = () => {
    store.onPositionChange()
    document.removeEventListener('mousemove', mousemoveHandle, true)
    document.removeEventListener('mouseup', mouseupHandle, true)
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
  const mousedownHandle = (e: MouseEvent) => {
    if (editable.value != item.id) {
      const el = e.currentTarget as HTMLElement
      cdata.mX = e.pageX
      cdata.mY = e.pageY
      cdata.eX = item.x
      cdata.eY = item.y
      store.selectElement({ id: item.id, h: el.clientHeight, w: el.clientWidth })
      document.addEventListener('mousemove', mousemoveHandle, true)
      document.addEventListener('mouseup', mouseupHandle, true)
    } else {
      document.addEventListener('mouseup', selectionHandle, true)
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
    getSelectedText,
  }
}
