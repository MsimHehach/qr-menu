<template>
  <div
    @click="$emit('select', item)"
    class="row full-width items-center justify-between cursor-pointer body py-7"
  >
    <div class="row no-wrap items-center gap-5">
      <RoundedSelector
        height="24px"
        width="24px"
        :model-value="!!item.quantity"
      />
      <!-- <div
        :class="!!item.quantity ? 'radio-selected' : 'radio'"
        style="height: 24px; width: 24px; border-radius: 50%"
        class="row items-center justify-center"
      >
        <div
          v-if="!!item.quantity"
          class="bg-primary"
          style="height: 10px; width: 10px; border-radius: 50%"
        ></div>
      </div> -->
      <div :class="{ 'text-primary': item.quantity }">
        {{ item.name }}
      </div>
    </div>
    <div
      :class="{ 'text-primary': item.quantity }"
      :style="item.quantity ? '' : 'opacity: 0.5'"
    >
      +{{ item.price }} ₽
    </div>
  </div>
</template>
<script lang="ts" setup>
import RoundedSelector from 'src/components/template/buttons/RoundedSelector.vue'
import { MenuModifierGroupItem } from 'src/models/menu/menuModifierGroup/menuModifierGroup'

defineProps<{
  item: MenuModifierGroupItem
}>()

defineEmits<{
  (evt: 'select', val: MenuModifierGroupItem): void
}>()
</script>

<style lang="scss" scoped>
.radio-selected {
  border: 1px var(--primary) solid;
}
.radio {
  border: 1px var(--secondary-button-color) solid;
}
</style>
