<template>
  <li class="dropdown">
    <button @click.prevent="show = !show" v-tooltip="'Emoji'">
      <i class="material-icons">sentiment_satisfied_alt</i>
    </button>
    <PopOver :width="230" :height="245" v-show="show" style="padding: 0">
      <ul class="emoji-selector">
        <li
          v-for="{ name, sym } in groups"
          :key="name"
          :class="[selectedGroup === name ? 'active' : '']"
          @click.stop.prevent="selectGroup(name)"
        >
          <a>{{ sym }}</a>
        </li>
      </ul>
      <div class="tab-content">
        <EmojiTab
          v-for="grp in groups"
          :key="`t-${grp.name}`"
          :selected="selectedGroup"
          :title="grp.name"
        >
          <span
            class="icon"
            v-for="(value, name) in emojis[grp.name]"
            :key="name"
            @click.stop.prevent="selectEmoji(value)"
            >{{ value }}</span
          >
        </EmojiTab>
      </div>
    </PopOver>
  </li>
</template>
<script setup lang="ts">
import emojisList from '@/utility/emojis'
import EmojiTab from '@/components/Menu/EmojiTab.vue'
import PopOver from '@/components/Menu/PopOver.vue'
import { computed, ref } from 'vue'
import type { EmojiGroups } from '@/types'
import { useStore } from '@/stores'

const store = useStore()
const emojis: EmojiGroups = emojisList

const groups = ref([
  { name: 'People', sym: emojis['People']['smile'] },
  { name: 'Nature', sym: emojis['Nature']['dog'] },
  { name: 'Foods', sym: emojis['Foods']['green apple'] },
  { name: 'Objects', sym: emojis['Objects']['gift'] },
  { name: 'Places', sym: emojis['Places']['house'] },
  { name: 'Symbols', sym: emojis['Symbols']['100'] },
])
const selectedGroup = ref('People')
const show = computed({
  get: () => store.getOpenState('emoji'),
  set: (val) => store.setIsOpen(['emoji', val]),
})

const selectEmoji = (em: string) => {
  store.setFormatEvent(['insertText', em])
}

const selectGroup = (name: string) => {
  selectedGroup.value = name
}
</script>
