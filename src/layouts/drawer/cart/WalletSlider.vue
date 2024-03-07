<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="bg-bonus-color border-radius text-on-bonus-color px-6 py-5">
    <div class="row no-wrap items-center justify-between">
      <div class="row gap-5 no-wrap items-center">
        <div class="py-5 px-6 bg-white-opacity border-radius box-shadow">
          <CIcon color="on-bonus-color" name="fa-light fa-piggy-bank" />
        </div>
        <div class="column gap-1">
          <div class="caption-text">Баллы</div>
          <div class="header3">
            {{ item.wallet.balance }}
          </div>
        </div>
      </div>
      <CButton
        @click="applyClickHandler()"
        text-button
        text-color="on-bonus-color"
      >
        <div class="secondary-text" style="text-decoration: underline">
          Применить
        </div>
      </CButton>
    </div>
    <div
      v-if="usePointsMode"
      class="column gap-10 bg-background-color text-on-backing-color border-radius px-6 py-8 mt-7"
    >
      <div class="row no-wrap justify-between body bold">
        <div>Доступно</div>
        <div>
          <span class="text-positive">{{ item.applied_sum }}</span>
          {{ '/' + item.max_sum }}
        </div>
      </div>
      <q-slider
        color="primary"
        thumb-color="primary"
        :min="0"
        :max="item.max_sum"
        v-model="item.applied_sum"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { WalletPaymentRaw } from 'src/models/carts/cart'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CButton from 'src/components/template/buttons/CButton.vue'

defineProps<{
  item: WalletPaymentRaw
}>()

const emit = defineEmits<{
  (evt: 'apply'): void
}>()

const usePointsMode = ref(false)

const applyClickHandler = () => {
  if (!usePointsMode.value) {
    usePointsMode.value = true
  } else {
    emit('apply')
  }
}
</script>
