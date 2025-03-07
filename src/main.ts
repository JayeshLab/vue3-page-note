import { createApp, type DebuggerEvent } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/assets/app.scss'
import Image from './components/Elements/ImageElement.vue'
import Text from './components/Elements/TextElement.vue'
import api from './utility/api'

const autoSaveActions = [
  'addTextElement',
  'updateHtmlText',
  'addImageElement',
  'removeElement',
  'updatePageTitle',
]
const autoSaveFont = ['addFont', 'delFont']

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.component('ImageElement', Image)
app.component('TextElement', Text)

// Tooltip directive
app.directive('tooltip', {
  mounted(el, binding) {
    el.addEventListener('mouseenter', function () {
      const $tooltip = document.createElement('div')
      const $tooltipDimension = el.getBoundingClientRect()
      $tooltip.setAttribute('class', 'tooltip')
      $tooltip.setAttribute('id', 'ToolTip')
      $tooltip.innerHTML = binding.value
      $tooltip.style.left = $tooltipDimension.left + $tooltipDimension.width / 2 + 'px'
      $tooltip.style.top = $tooltipDimension.top - 30 + 'px'
      document.body.appendChild($tooltip)
    })
    el.addEventListener('mouseleave', function () {
      const elemToRemove = document.getElementById('ToolTip')
      if (elemToRemove && elemToRemove.parentNode) {
        elemToRemove.parentNode.removeChild(elemToRemove)
      }
    })
  },
})
app.mount('#app')
