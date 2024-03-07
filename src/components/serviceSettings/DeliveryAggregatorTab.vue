<template>
  <div class="px-xs-8 px-md-0 py-md-0 py-xs-12">
    <div v-if="$q.screen.lt.md" class="row full-width mb-8 gap-4 items-center">
      <CIcon
        @click="$emit('back')"
        name="fa-regular fa-angle-left"
        color="on-background-color"
        hover-color="primary"
        class="cursor-pointer"
        size="22px"
      />
      <div class="header3 bold">
        {{ tab?.label }}
      </div>
    </div>
    <div class="row full-width gap-8 items-center no-wrap">
      <q-img
        src="assets/deliveryLogo.png"
        width="62px"
        height="62px"
        style="min-width: 62px"
      ></q-img>
      <div class="text-on-background-color body">
        Оформление Delivery Club доставки возможно при переходе на другую
        платформу. Стоимость блюд может измениться
      </div>
    </div>
    <CButton
      @click="openLink()"
      label="Оформить в Деливери"
      class="body mt-18"
      height="48px"
      width="100%"
    />
  </div>
</template>
<script lang="ts" setup>
import CButton from '../template/buttons/CButton.vue'
import CIcon from '../template/helpers/CIcon.vue'
import { TabRaw } from './ServiceSettingsModal.vue'

const props = defineProps<{
  tab: TabRaw | null
}>()

defineEmits<{
  (evt: 'back'): void
}>()

const openLink = () => {
  window.open(props.tab?.link || undefined, '_blank')
}
</script>
