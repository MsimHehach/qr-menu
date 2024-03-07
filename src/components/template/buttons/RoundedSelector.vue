<template>
  <div
    :class="modelValue ? (check ? 'bg-primary' : 'radio-selected') : ''"
    style="border-radius: 50%"
    class="row items-center justify-center"
    :style="[
      `height: ${height || '29px'}; width: ${width || '29px'}; max-width:${
        width || '29px'
      }; min-width: ${width || '29px'}; max-height:${
        height || '29px'
      }; min-height:${height || '29px'}`,
      modelValue
        ? ''
        : `border: 1px #${$uiSettings.item?.secondaryColor.color} solid`,
    ]"
  >
    <div
      v-if="modelValue && !check"
      class="bg-primary"
      style="height: 10px; width: 10px; border-radius: 50%"
    ></div>
    <q-icon
      v-if="modelValue && check"
      color="on-primary"
      name="fa-regular fa-check"
      :size="iconSize || '17px'"
    />
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  height?: string
  width?: string
  check?: boolean
  iconSize?: string
}>()
</script>

<style scoped lang="scss">
.radio-selected {
  border: 1px var(--primary) solid;
}
</style>
