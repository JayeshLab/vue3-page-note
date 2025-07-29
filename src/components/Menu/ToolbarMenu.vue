<template>
  <div class="toolbar-container no-print">
    <ul class="toolbar cf">
      <li>
        <button @click.stop.prevent="addTextElement('TextElement')" v-tooltip="`Add Text`">
          <i class="material-icons">title</i>
        </button>
      </li>
      <image-menu></image-menu>
    </ul>
    <ul class="toolbar cf">
      <li>
        <button @click.stop.prevent="formatDoc('undo')" v-tooltip="'Undo'">
          <i class="material-icons">undo</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('redo')" v-tooltip="'Redo'">
          <i class="material-icons">redo</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="clearPage" v-tooltip="'Reset Page'">
          <i class="material-icons">restart_alt</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('removeFormat')" v-tooltip="'Clean Format'">
          <i class="material-icons">format_clear</i>
        </button>
      </li>
    </ul>
    <ul class="toolbar cf">
      <li>
        <button @click.stop.prevent="formatDoc('bold')" v-tooltip="'Bold'">
          <i class="material-icons">format_bold</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('italic')" v-tooltip="'Italic'">
          <i class="material-icons">format_italic</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('underline')" v-tooltip="'Underline'">
          <i class="material-icons">format_underlined</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('justifyleft')" v-tooltip="'Align Left'">
          <i class="material-icons">format_align_left</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('justifycenter')" v-tooltip="'Align Center'">
          <i class="material-icons">format_align_center</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('justifyright')" v-tooltip="'Align Right'">
          <i class="material-icons">format_align_right</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('insertorderedlist')" v-tooltip="'Ordered List'">
          <i class="material-icons">format_list_numbered</i>
        </button>
      </li>
      <li>
        <button @click.stop.prevent="formatDoc('insertunorderedlist')" v-tooltip="'List'">
          <i class="material-icons">format_list_bulleted</i>
        </button>
      </li>
      <li class="dropdown">
        <button @click="isLayerMenu = !isLayerMenu" v-tooltip="'Layers'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="m19.474 12.838 1.697.835a1 1 0 0 1 0 1.795L13.32 19.33a3 3 0 0 1-2.649 0L2.82 15.468a1 1 0 0 1 0-1.795l1.697-.835 1.698.836-1.821.896 6.94 3.415a1.5 1.5 0 0 0 1.324 0l6.94-3.415-1.822-.896 1.7-.836ZM13.32 4.673l7.852 3.864a1 1 0 0 1 0 1.794l-7.852 3.864a3 3 0 0 1-2.649 0L2.82 10.33a1 1 0 0 1 0-1.794l7.851-3.864a3 3 0 0 1 2.65 0Zm-1.986 8.176a1.5 1.5 0 0 0 1.324 0l6.94-3.415-6.94-3.415a1.5 1.5 0 0 0-1.324 0l-6.94 3.415 6.94 3.415Z"
            />
          </svg>
        </button>
        <pop-over :width="146" :height="30" v-show="isLayerMenu">
          <ul class="htoolbar">
            <li>
              <button
                @click.stop.prevent="updateLayer('bringforward')"
                v-tooltip:down="'Bring forward'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.75 5.82v8.43a.75.75 0 1 1-1.5 0V5.81L8.99 8.07A.75.75 0 1 1 7.93 7l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 7A.75.75 0 0 1 15 8.07l-2.25-2.25zM15 10.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8L9 10.49v1.67L4.4 14.4l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26v-1.67z"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                @click.stop.prevent="updateLayer('bringfront')"
                v-tooltip:down="'Bring to front'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.75 3.82v9.43a.75.75 0 1 1-1.5 0V3.81L8.99 6.07A.75.75 0 1 1 7.93 5l2.83-2.83a1.75 1.75 0 0 1 2.47 0L16.06 5A.75.75 0 0 1 15 6.07l-2.25-2.25zM15 8.48l6.18 3.04a1 1 0 0 1 0 1.79l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8L9 8.49v1.67L4.4 12.4l6.94 3.42c.42.2.9.2 1.32 0l6.94-3.42-4.6-2.26V8.48zm4.48 7.34 1.7.83a1 1 0 0 1 0 1.8l-7.86 3.86a3 3 0 0 1-2.64 0l-7.86-3.86a1 1 0 0 1 0-1.8l1.7-.83 1.7.83-1.82.9 6.94 3.41c.42.2.9.2 1.32 0l6.94-3.41-1.82-.9 1.7-.83z"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                @click.stop.prevent="updateLayer('sendbackward')"
                v-tooltip:down="'Send backward'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.75 18.12V9.75a.75.75 0 1 0-1.5 0v8.37l-2.26-2.25a.75.75 0 0 0-1.06 1.06l2.83 2.82c.68.69 1.79.69 2.47 0l2.83-2.82A.75.75 0 0 0 15 15.87l-2.25 2.25zM15 11.85v1.67l6.18-3.04a1 1 0 0 0 0-1.79l-7.86-3.86a3 3 0 0 0-2.64 0L2.82 8.69a1 1 0 0 0 0 1.8L9 13.51v-1.67L4.4 9.6l6.94-3.42c.42-.2.9-.2 1.32 0L19.6 9.6 15 11.85z"
                  />
                </svg>
              </button>
            </li>
            <li>
              <button @click.stop.prevent="updateLayer('sendback')" v-tooltip:down="'Send to back'">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="m19.48 10.82 1.7.83a1 1 0 0 1 0 1.8L15 16.49V14.8l4.6-2.26-1.82-.9 1.7-.83zm-14.96 0-1.7.83a1 1 0 0 0 0 1.8L9 16.49V14.8l-4.6-2.26 1.82-.9-1.7-.83zm8.23 9.5L15 18.07a.75.75 0 0 1 1.06 1.06l-2.83 2.83c-.68.68-1.79.68-2.47 0l-2.83-2.83a.75.75 0 0 1 1.06-1.06l2.26 2.26V6.9a.75.75 0 1 1 1.5 0v13.43zM15 11.35V9.68l4.6-2.27L12.66 4c-.42-.2-.9-.2-1.32 0L4.4 7.4 9 9.68v1.67L2.82 8.3a1 1 0 0 1 0-1.8l7.86-3.86a3 3 0 0 1 2.64 0l7.86 3.87a1 1 0 0 1 0 1.79L15 11.35z"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </pop-over>
      </li>
      <emoji-picker></emoji-picker>
      <li class="dropdown">
        <button @click="isFontMenu = !isFontMenu" v-tooltip="'Font'">
          <i class="material-icons">font_download</i>
        </button>
        <pop-over :width="200" :height="240" v-show="isFontMenu">
          <div v-for="font in fonts" :key="font" class="font-display">
            <button
              @click.stop.prevent="formatDoc('fontname', font)"
              :style="{ fontFamily: font }"
              class="font-btn"
            >
              {{ font }}
            </button>
            <button class="font-del-btn" @click="delFont(font)">X</button>
          </div>
          <div class="input-with-icon" style="margin-top: 10px">
            <input
              class="input-link"
              type="text"
              v-model="fontName"
              placeholder="Add Google Font Name"
              @keyup.enter="addFont"
            />
            <i class="material-icons input-icon" @click="addFont">add</i>
          </div>
        </pop-over>
      </li>
      <li class="dropdown">
        <button @click="isSize = !isSize" v-tooltip="'Font Size'">
          <i class="material-icons">format_size</i>
        </button>
        <pop-over :width="220" :height="215" v-show="isSize">
          <button @click.stop.prevent="formatDoc('fontsize', '1')" class="tool-btn">
            <font size="1">Very small</font>
          </button>
          <button @click.stop.prevent="formatDoc('fontsize', '2')" class="tool-btn">
            <font size="2">A bit small</font>
          </button>
          <button @click.stop.prevent="formatDoc('fontsize', '3')" class="tool-btn">
            <font size="3">Normal</font>
          </button>
          <button @click.stop.prevent="formatDoc('fontsize', '4')" class="tool-btn">
            <font size="4">Medium-large</font>
          </button>
          <button @click.stop.prevent="formatDoc('fontsize', '5')" class="tool-btn">
            <font size="5">Big</font>
          </button>
          <button @click.stop.prevent="formatDoc('fontsize', '6')" class="tool-btn">
            <font size="6">Very big</font>
          </button>
          <button @click.stop.prevent="formatDoc('fontsize', '7')" class="tool-btn">
            <font size="7">Maximum</font>
          </button>
        </pop-over>
      </li>
      <li class="dropdown">
        <button @click="isFontSize = !isFontSize" v-tooltip="'Paragraph Format'">
          <i class="material-icons">local_parking</i>
        </button>
        <pop-over :width="330" :height="30" v-show="isFontSize">
          <ul class="htoolbar">
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'h1')">H1</button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'h2')">H2</button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'h3')">H3</button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'h4')">H4</button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'h5')">H5</button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'h6')">H6</button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'blockquote')">
                <i class="material-icons">format_quote</i>
              </button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'p')">
                <i class="material-icons">local_parking</i>
              </button>
            </li>
            <li>
              <button @click.stop.prevent="formatDoc('formatblock', 'pre')">
                <small>Pre</small>
              </button>
            </li>
          </ul>
        </pop-over>
      </li>
      <color-picker type="forecolor" icon="format_color_text" tip="Text Color"></color-picker>
      <color-picker type="backcolor" icon="color_lens" tip="Background Color"></color-picker>
    </ul>
  </div>
</template>
<script setup lang="ts">
import EmojiPicker from './EmojiPickerMenu.vue'
import ColorPicker from './ColorPickerMenu.vue'
import ImageMenu from './ImageMenu.vue'
import PopOver from './PopOver.vue'
import WebFontLoader from 'webfontloader'

import { ref, computed } from 'vue'
import { useStore } from '@/stores'

const store = useStore()

const fontName = ref('')

const isFontMenu = computed({
  get: () => store.getOpenState('font'),
  set: (val) => store.setIsOpen(['font', val]),
})
const isFontSize = computed({
  get: () => store.getOpenState('headings'),
  set: (val) => store.setIsOpen(['headings', val]),
})
const isLayerMenu = computed({
  get: () => store.getOpenState('layers'),
  set: (val) => store.setIsOpen(['layers', val]),
})
const isSize = computed({
  get: () => store.getOpenState('size'),
  set: (val) => store.setIsOpen(['size', val]),
})
const fonts = computed(() => store.state.fonts)

const addTextElement = (type: string) => {
  store.setIsOpen(['', false])
  store.addTextElement(type)
}
const updateLayer = (layer: string) => {
  store.setIsOpen(['', false])
  store.updateLayer(layer)
}
const savePage = () => {
  store.setIsOpen(['', false])
}
const clearPage = () => {
  store.setIsOpen(['', false])
  store.clearPage()
}
const formatDoc = (cmd: string, val?: string) => {
  store.setIsOpen(['', false])
  document.execCommand('styleWithCSS', true)
  document.execCommand(cmd, false, val)
}
const addFont = () => {
  if (fontName.value != '') {
    store.addFont(fontName.value)
    WebFontLoader.load({
      google: {
        families: store.state.fonts,
      },
      active: function () {
        fontName.value = ''
      },
    })
  }
}
const delFont = (fontName: string) => {
  if (fontName != '') {
    store.delFont(fontName)
  }
}
</script>
