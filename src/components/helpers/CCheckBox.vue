<template>
  <q-checkbox
    @update:model-value="$emit('update:modelValue', $event)"
    :model-value="modelValue"
    dense
    :size="size"
    :label="label"
    :color="color"
  ></q-checkbox>
</template>
<script lang="ts" setup>
defineProps<{
  modelValue: boolean
  size?: string
  color?: string
  label?: string
}>()

defineEmits<{
  (evt: 'update:modelValue', val: boolean): void
}>()
</script>

<style lang="scss" scoped>
.q-checkbox :deep(.q-checkbox__bg) {
  border-radius: 6px;
  //   border: 2px var(--secondary-button-color) solid;
}

.q-checkbox :deep(.q-checkbox__inner--falsy) {
  color: var(--on-background-color);
}
</style>
