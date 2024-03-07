<template>
  <div
    @click="$emit('select', item)"
    class="row full-width no-wrap items-center justify-between cursor-pointer body py-3"
  >
    <div class="column gap-2">
      <div>{{ item.name }}</div>
      <div
        :class="{ 'text-primary': item.quantity }"
        :style="item.quantity ? '' : 'opacity: 0.5'"
      >
        +{{ item.price }} ₽
      </div>
    </div>

    <c-check-box
      @click="$emit('select', item)"
      :model-value="!!item.quantity"
      size="48px"
    />
  </div>
</template>
<script lang="ts" setup>
import CCheckBox from 'src/components/helpers/CCheckBox.vue'
import { MenuModifierGroupItem } from 'src/models/menu/menuModifierGroup/menuModifierGroup'

defineProps<{
  item: MenuModifierGroupItem
}>()

defineEmits<{
  (evt: 'select', val: MenuModifierGroupItem): void
}>()
</script>
