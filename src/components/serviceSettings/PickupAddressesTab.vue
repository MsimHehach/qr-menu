<template>
  <div class="px-xs-8 px-md-0 py-md-0 py-xs-12">
    <div
      v-if="$q.screen.lt.md"
      class="row full-width gap-4 items-center no-wrap mb-10"
    >
      <CIcon
        @click="$emit('back')"
        size="22px"
        color="on-background-color"
        hover-color="primary"
        name="fa-regular fa-angle-left"
        class="cursor-pointer"
      />
      <div class="header3 bold">Адреса самовывоза</div>
    </div>
    <div
      class="column no-wrap full-width gap-md-8 gap-xs-2 pb-md-10 pb-xs-12"
      style="overflow: scroll"
      :style="`height: ${$q.screen.lt.md ? 'unset' : '374px'}; max-height:${
        $q.screen.lt.md ? '45vh' : 'unset'
      }`"
    >
      <template v-if="availablePickupAddresses?.length">
        <div
          v-for="(el, index) in availablePickupAddresses"
          :key="index"
          class="row items-center pa-md-10 py-xs-5 justify-between cursor-pointer border-radius"
          @click="$emit('select', el)"
          :style="
            $q.screen.lt.md ? '' : `border: 1px ${getBorderColor(el)} solid`
          "
        >
          <div class="row items-center gap-6 no-wrap">
            <RoundedSelector
              :height="$q.screen.lt.md ? '22px' : '24px'"
              :width="$q.screen.lt.md ? '22px' : '24px'"
              :model-value="el.id === currentPoint?.id"
            />
            <div class="body ellipsis-2-lines">
              {{ el.customAddress || el.address }}
            </div>
          </div>
          <!-- <CIcon
          class="cursor-pointer"
          hover-color="primary"
          size="22px"
          name="fa-light fa-pen"
          color="secondary-button-color"
        /> -->
        </div>
      </template>
      <div v-else class="subtitle-text">Адреса заведения не указаны</div>
    </div>
    <div v-if="$slots.bottom" class="row bg-background-color border-radius">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import RoundedSelector from '../template/buttons/RoundedSelector.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { computed } from 'vue'
import { companyRepo } from 'src/models/company/companyRepo'
import { SalesPoint } from 'src/models/salesPoint/salesPoint'
import CIcon from '../template/helpers/CIcon.vue'

const props = defineProps<{
  currentPoint: SalesPoint | null
}>()

defineEmits<{
  (evt: 'select', val: SalesPoint): void
  (evt: 'confirm'): void
  (evt: 'addAddress'): void
  (evt: 'back'): void
}>()

const availablePickupAddresses = computed(() => {
  return companyRepo.cartCompany?.salesPoints?.filter(
    (v) => v.settings.pickup_enabled
  )
})

const getBorderColor = (el: SalesPoint) => {
  return props.currentPoint?.id === el.id
    ? '#' + uiSettingsRepo.item?.primaryColor.color
    : '#' + uiSettingsRepo.item?.secondaryColor.color
}
</script>
