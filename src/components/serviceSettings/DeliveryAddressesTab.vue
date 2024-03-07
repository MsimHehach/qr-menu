<template>
  <div
    class="full-width"
    :class="{ 'px-xs-8 px-md-0 py-md-0 py-xs-12': !noPadding }"
  >
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
      <div class="header3 bold">Доставка</div>
    </div>
    <div
      class="column no-wrap full-width gap-md-8 gap-xs-2 pb-md-10 pb-xs-12"
      style="overflow: scroll"
      :style="$q.screen.gt.sm ? 'height: 374px !important' : `max-height: 80vh`"
    >
      <template v-if="$deliveryAddress.items.length">
        <div
          v-for="(el, index) in $deliveryAddress.items"
          :key="index"
          class="row items-center full-width pa-md-10 py-xs-5 justify-between cursor-pointer border-radius"
          @click="$emit('select', el)"
          :style="
            $q.screen.lt.md ? '' : `border: 1px ${getBorderColor(el)} solid`
          "
        >
          <div class="row col-10 items-center gap-6 no-wrap">
            <RoundedSelector
              height="24px"
              width="24px"
              :model-value="el.id === currentAddress?.id"
            />
            <div class="column gap-4 body">
              <div class="bold ellipsis-2-lines">
                {{ el.name }}
              </div>
              <div class="ellipsis-2-lines">
                {{ el.address }}
              </div>
            </div>
          </div>
          <CIcon
            v-if="!selectionOnly"
            @click="$emit('edit', el)"
            class="cursor-pointer"
            hover-color="primary"
            size="22px"
            name="fa-light fa-pen"
            color="secondary"
          />
        </div>
      </template>
      <div v-else class="subtitle-text mb-xs-6 mb-md-0">
        У вас нет адресов доставки
      </div>
      <div v-if="$q.screen.lt.md && !selectionOnly">
        <CButton
          @click="$emit('addAddress')"
          label="Добавить новый адрес"
          icon="fa-regular fa-plus"
          text-button
          text-color="primary"
          class="body"
          icon-size="24px"
        />
      </div>
    </div>
    <div
      v-if="$slots.bottom"
      class="row bg-background-color full-width border-radius"
    >
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import RoundedSelector from '../template/buttons/RoundedSelector.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import CIcon from '../template/helpers/CIcon.vue'
import CButton from '../template/buttons/CButton.vue'

const props = defineProps<{
  currentAddress: DeliveryAddress | null
  noPadding?: boolean
  selectionOnly?: boolean
}>()

defineEmits<{
  (evt: 'select', val: DeliveryAddress): void
  (evt: 'edit', val: DeliveryAddress): void
  (evt: 'back'): void
  (evt: 'addAddress'): void
}>()

const getBorderColor = (el: DeliveryAddress) => {
  return props.currentAddress?.id === el.id
    ? '#' + uiSettingsRepo.item?.primaryColor.color
    : '#' + uiSettingsRepo.item?.secondaryColor.color
}
</script>
