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
const isSize = computed({
  get: () => store.getOpenState('size'),
  set: (val) => store.setIsOpen(['size', val]),
})
const fonts = computed(() => store.state.fonts)

const addTextElement = (type: string) => {
  store.setIsOpen(['', false])
  store.addTextElement(type)
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
