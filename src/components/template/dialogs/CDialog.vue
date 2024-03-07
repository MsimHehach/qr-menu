<template>
  <q-dialog
    class="no-shadow"
    :position="position"
    :persistent="persistent"
    :square="square"
    :modelValue="modelValue"
    @update:modelValue="$emit('update:modelValue')"
    :class="{ 'maximize-modal': maximize }"
  >
    <q-card
      :style="`max-width: ${width}; min-height: ${height}; max-height: ${height}; height: ${heightPercent}; border-radius:${
        position === 'bottom' ? bottomBorderRadius() : ''
      }`"
      style="width: 100%; display: flex; transition: 0.2s"
      class="relative-position no-overflow column no-wrap no-shadow bg-background-color"
      :class="{ 'border-radius': position !== 'bottom' }"
    >
      <div
        v-if="$slots.header"
        class="row full-width items-center header3 bold px-md-15 px-xs-8 bg-background-color text-on-background-color mt-15"
      >
        <slot name="header"></slot>
      </div>

      <div
        :class="[
          !noPadding ? 'pb-md-15 pb-xs-12 px-md-15 px-xs-8' : dialogClass,
          noPadding ? '' : $slots.header ? 'pt-10' : 'pt-md-15 pt-xs-12',
        ]"
        :style="`overflow-y:${noOverflow ? 'hidden' : 'auto'};
          width: 100%;
          height: 100%;
          max-height: inherit;
          overflow-x: hidden
          `"
      >
        <div style="position: absolute; top: -24px; right: -29px; z-index: 1">
          <CIcon
            v-if="!noClose"
            class="cursor-pointer"
            hoverColor="primary"
            color="white"
            name="fa-light fa-xmark"
            size="32px"
            v-close-popup
          />
        </div>

        <slot></slot>
        <q-card-actions
          :align="alignActions"
          v-if="!hideActions && $slots['card-actions']"
        >
          <slot name="card-actions"></slot>
        </q-card-actions>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import CIcon from '../helpers/CIcon.vue'

defineProps({
  hideActions: Boolean,
  alignActions: {
    type: String,
    default: 'center',
  },
  modelValue: Boolean,
  square: Boolean,
  width: {
    type: String,
    default: '654px',
  },
  height: {
    type: String,
  },
  position: {
    type: String,
    default: 'standard',
  },
  noClose: Boolean,
  persistent: Boolean,
  noPadding: Boolean,
  dialogClass: String,
  image: String,
  imageClass: String,
  imageWidth: String,
  noOverflow: Boolean,
  heightPercent: String,
  withOverflow: Boolean,
  maximize: Boolean,
})
defineEmits(['update:modelValue'])

const bottomBorderRadius = () => {
  return `${uiSettingsRepo.item?.borderRadius}px ${uiSettingsRepo.item?.borderRadius}px 0 0`
}
</script>

<style lang="scss" scoped>
.no-overflow {
  overflow: unset !important;
}

.closeBtn :deep(.q-btn__content .q-icon) {
  position: absolute;
}

.closeBtn::before {
  box-shadow: -1px 1px 8px rgb(0 0 0 / 10%) !important;
}

.closeBtn :deep(.q-btn__content .q-icon):hover {
  color: $accent3;
  transition: 0.25s;
}

.closeBtn :deep(.q-btn__content .q-icon) {
  color: $secondary;
  transition: 0.25s;
}
</style>
