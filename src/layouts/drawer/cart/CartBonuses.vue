<template>
  <div class="full-width">
    <div class="full-width header3 bold mb-5">Баллы</div>
    <div class="row full-width items-center gap-5s justify-between">
      <div class="row items-center gap-7 no-wrap">
        <!-- <q-img src="~assets/rubleIcon.png" height="44px" width="44px"></q-img> -->
        <c-icon
          name="fa-light fa-coin-vertical"
          size="44px"
          color="on-background-color"
        />
        <div class="subtitle-text">Списать {{ maxSum }} бонусов</div>
      </div>
      <q-toggle
        @update:model-value="toggleClickHandler"
        :model-value="currentChoice === 2"
        dense
        size="52px"
        color="primary"
      ></q-toggle>
    </div>
    <!-- <div
      class="row bg-selector-color text-on-selector-color no-wrap full-width border-radius pa-1 body"
    >
      <div
        @click="discard()"
        :class="{
          'bg-selector-active-color bold text-on-selector-active-color':
            currentChoice === 1,
        }"
        class="col py-5 cursor-pointer row justify-center border-radius"
      >
        Не списывать
      </div>
      <div
        @click="applyClickHandler()"
        :class="{
          'bg-selector-active-color bold text-on-selector-active-color':
            currentChoice === 2,
        }"
        class="col row py-5 cursor-pointer justify-center border-radius"
      >
        Списать {{ maxSum }}
      </div>
    </div> -->
  </div>
</template>
<script lang="ts" setup>
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { ref, computed } from 'vue'

const currentChoice = ref(1)

const maxSum = computed(() => {
  if (!cartRepo.item) return 0
  return cartRepo.item.walletPayments[0].wallet.balance >
    cartRepo.item.walletPayments[0].max_sum
    ? cartRepo.item.walletPayments[0].max_sum
    : cartRepo.item.walletPayments[0].wallet.balance
})

const toggleClickHandler = (v: boolean) => {
  if (v) {
    applyClickHandler()
  } else {
    discard()
  }
}

const applyClickHandler = () => {
  if (!cartRepo.item) return

  currentChoice.value = 2
  cartRepo.item.walletPayments[0].applied_sum = maxSum.value
}

const discard = () => {
  if (!cartRepo.item) return
  cartRepo.item.walletPayments[0].applied_sum = 0
  currentChoice.value = 1
}
</script>
