<template>
  <div
    class="full-width"
    style="gap: 20px"
    :style="`display: grid; grid-template-columns:  ${
      products && $q.screen.width < 415
        ? 'repeat(auto-fill, minmax(175px, 1fr));'
        : `repeat(${columns}, minmax(0, 1fr))`
    }`"
  >
    <div v-for="(item, index) in items" :key="index">
      <slot name="item" v-bind:item="item"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Screen } from 'quasar'
const props = defineProps({
  items: Array,
  sm: { type: [Number, String], default: 2 },
  md: { type: [Number, String], default: 4 },
  lg: { type: [Number, String], default: 4 },
  xl: { type: [Number, String], default: 5 },
  xs: { type: [Number, String], default: 2 },
  products: Boolean,
})

const columns = computed(() => {
  const name = Screen.name
  return props[name]
})
</script>
