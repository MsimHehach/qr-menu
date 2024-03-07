<template>
  <div class="row items-center" ref="iconParent">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { onMounted, ref } from 'vue'

const iconParent = ref<HTMLDivElement>()

onMounted(() => {
  if (!iconParent.value) return
  const path = iconParent.value.getElementsByTagName('path')
  path[0].setAttribute(
    'fill',
    '#' + uiSettingsRepo.item?.backgroundColor.on_color || '#000'
  )
})
</script>

<style lang="scss" scoped></style>
