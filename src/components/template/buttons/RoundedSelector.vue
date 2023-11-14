<template>
  <div
    :class="modelValue ? 'bg-primary' : 'unselected'"
    style="
      min-height: 29px;
      max-width: 29px;
      max-height: 29px;
      min-width: 29px;
      border-radius: 50%;
    "
    class="row justify-center items-center"
    :style="modelValue ? '' : 'border: 1px on-background-color solid'"
  >
    <CIcon
      :style="`visibility: ${modelValue ? 'visible' : 'hidden'}`"
      name="fa-solid fa-check"
      color="background-color"
      size="17px"
    />
  </div>
</template>
<script lang="ts" setup>
import CIcon from '../helpers/CIcon.vue'

defineProps<{
  modelValue: boolean
}>()
</script>

<style scoped lang="scss">
.unselected {
  border: 1px var(--on-background-color) solid;
}
</style>
