<template>
  <div
    class="full-width"
    :style="`display: grid; grid-template-columns:  ${
      products && $q.screen.width < 415
        ? 'repeat(auto-fill, minmax(175px, 1fr));'
        : `repeat(${columns}, minmax(0, 1fr))`
    }; ${gap ? `gap: ${gap}` : $q.screen.xs ? 'gap: 14px' : 'gap: 30px'}; `"
  >
    <div v-for="(item, index) in items" :key="index">
      <slot name="item" v-bind:item="item"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Screen } from 'quasar'

const props = withDefaults(
  defineProps<{
    items: Array<any>
    sm?: number | string
    md?: number | string
    lg?: number | string
    xl?: number | string
    xs?: number | string
    products?: boolean
    gap?: string
  }>(),
  {
    sm: 2,
    md: 4,
    lg: 4,
    xl: 5,
    xs: 2,
  }
)

const columns = computed(() => {
  const name = Screen.name
  return props[name]
})
</script>
