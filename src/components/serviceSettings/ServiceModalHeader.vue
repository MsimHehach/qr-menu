<template>
  <div class="row gap-5 items-center">
    <template v-if="$slots.action">
      <slot name="action"></slot>
    </template>
    <div :class="$q.screen.lt.lg ? 'header3' : 'huge3'" class="bold">
      {{ getTitle() }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CartType } from 'src/models/carts/cart'
import { AggregatorType } from 'src/models/company/company'
import { TabRaw } from './ServiceSettingsModal.vue'

const props = defineProps<{
  tab: TabRaw | null
}>()

const getTitle = () => {
  if (!props.tab) return 'Тип доставки'
  if (props.tab.type === CartType.DELIVERY) return 'Адреса доставки'
  if (props.tab.type === CartType.PICKUP) return 'Адреса заведения'
  if (props.tab.type === CartType.BOOKING) return 'Забронировать'
  if (
    props.tab.type === AggregatorType.YANDEX ||
    props.tab.type === AggregatorType.DELIVERY_CLUB
  )
    return props.tab.label
}
</script>
