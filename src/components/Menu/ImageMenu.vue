<template>
  <li class="dropdown">
    <button @click.prevent="show = !show" v-tooltip="`Add Image`">
      <i class="material-icons">image</i>
    </button>
    <pop-over :width="230" :height="160" v-show="show">
      <div class="input-with-icon">
        <input
          class="input-link"
          type="text"
          v-model="imgurl"
          placeholder="Add Image link"
          @keyup.enter="addImageLink"
        />
        <i class="material-icons input-icon" @click="addImageLink">insert_link</i>
      </div>
      <div class="hr-line"><span>or</span></div>
      <div
        class="drop-zone"
        :class="[isOver ? 'bg-green' : 'bg-gray']"
        @click="triggerFile"
        @dragover.prevent="isOver = true"
        @dragleave.prevent="isOver = false"
        @drop="drop"
      >
        <span class="drop-zone-text"><b>Drop Image</b><br />(or click {{ isOver }})</span>
        <input
          ref="imgfile"
          name="imgfile"
          type="file"
          @change="fileUpdate"
          class="drop-zone-input"
          accept="image/png, image/jpeg"
        />
      </div>
    </pop-over>
  </li>
</template>
<script setup lang="ts">
import PopOver from './PopOver.vue'
import { computed, ref, watch, useTemplateRef } from 'vue'
import { useStore } from '@/stores'

const store = useStore()
const imgurl = ref('')
const isOver = ref(false)
const imgfile = useTemplateRef('imgfile')

const show = computed({
  get: () => store.getOpenState('img'),
  set: (val) => store.setIsOpen(['img', val]),
})
watch(
  () => show,
  () => (imgurl.value = ''),
)

const triggerFile = () => {
  const el = imgfile.value as HTMLInputElement
  el.click()
}

const drop = (event: DragEvent) => {
  event.preventDefault()
  const el = imgfile.value as HTMLInputElement
  if (event.dataTransfer) {
    el.files = event.dataTransfer.files
  }
  fileUpdate()
  isOver.value = false
}
const fileUpdate = () => {
  const el = imgfile.value as HTMLInputElement
  if (el.files?.length) {
    const file = el.files[0]
    if (/\.(jpe?g|png|gif|svg)$/i.test(file.name)) {
      const reader = new FileReader()
      reader.addEventListener(
        'load',
        function () {
          const image: HTMLImageElement = new Image()
          image.src = this.result as string
          image.onload = function () {
            store.addImageElement({
              height: image.height,
              image: image.src,
              width: image.width,
            })
            show.value = false
            imgurl.value = ''
          }
        },
        false,
      )
      reader.readAsDataURL(file)
    }
  }
}
const addImageLink = () => {
  if (/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/i.test(imgurl.value)) {
    const img = new Image()
    img.onload = function () {
      store.addImageElement({
        height: img.height,
        image: img.src,
        width: img.width,
      })
      show.value = false
      imgurl.value = ''
    }
    img.onerror = function () {
      alert('Not a valid Image file')
    }
    img.src = imgurl.value
  }
}
</script>
