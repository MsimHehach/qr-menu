<template>
  <div
    :style="`max-width: ${width}`"
    style="height: fit-content; flex-wrap: wrap"
    class="full-width row pa-1 gap-5"
  >
    <!-- min-width: 31.5%; max-width: 31.5% -->
    <div
      v-for="(size, index) in currentSizes"
      :key="index"
      @click="selectTabHandler(size)"
      :style="
        modelValue?.id === size.id
          ? 'transition: background-color 0.4s ease-out'
          : 'transition: background-color 0.3s ease-out'
      "
      style="text-align: center; min-width: 30%"
      :class="[
        modelValue?.id === size.id
          ? 'bg-selector-active-color bold text-on-selector-active-color box-shadow'
          : 'text-on-selector-color bg-selector-color',
        'py-5',
      ]"
      class="cursor-pointer border-radius col row items-center justify-center rounded-10 body"
    >
      <div class="ellipsis-2-lines">
        {{ size.name }}
        <slot name="append"></slot>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ItemSize } from 'src/models/menu/menu'
import { computed, ref } from 'vue'

const props = defineProps<{
  sizes: ItemSize[]
  modelValue?: ItemSize
  width?: string
}>()

const emit = defineEmits<{
  (evt: 'updateTab', value: ItemSize): void
}>()

const expanded = ref(false)

const currentSizes = computed(() => {
  if (props.sizes.length > 3 && !expanded.value) {
    const previewSizes = props.sizes.slice(0, 2)
    previewSizes.push(new ItemSize({ name: 'еще' }))
    return previewSizes
  } else return props.sizes
})

const selectTabHandler = (v: ItemSize) => {
  if (v.name === 'еще') {
    expanded.value = true
  } else {
    emit('updateTab', v)
  }
}
</script>

<stype lang="scss" scoped></stype>
