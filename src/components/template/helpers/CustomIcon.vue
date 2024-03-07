<template>
  <!-- <object
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :data="getImage()"
    :width="width || 22"
    :height="height || 22"
    class="icon"
    type="image/svg+xml"
  ></object> -->
  <!-- <rect width="100" height="100" fill="#f06"></rect> -->

  <div
    :style="`background: url(${getImage()}); width: ${
      width || '22px'
    }; min-width: ${width || '22px'};  height: ${
      height || '22px'
    }; background-repeat: no-repeat; background-size: contain;`"
  ></div>
</template>
<script lang="ts" setup>
import { store } from 'src/models/store'

const props = defineProps<{
  name: string
  width?: string
  height?: string
}>()

const getImage = () => {
  try {
    return require('assets/icons/' + props.name)
  } catch {
    return store.images.empty
  }
}
</script>

<style lang="scss" scoped></style>
