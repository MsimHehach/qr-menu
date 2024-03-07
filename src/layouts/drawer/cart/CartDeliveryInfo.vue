<template>
  <div
    @click="openDialog()"
    class="bg-backing-color cursor-pointer text-on-backing-color border-radius row no-wrap full-width pa-10 gap-8 items-center"
  >
    <img
      v-if="$company.item?.image?.thumbnail"
      height="50"
      class="border-radius2"
      style="object-fit: contain"
      :src="$company.item?.image?.thumbnail"
    />
    <div style="height: fit-content" class="body column gap-2">
      <div class="bold">{{ cartDateInfo }}</div>
      <div class="row no-wrap gap-2">
        <div>Адрес:</div>
        <div class="ellipsis-2-lines">
          {{ $cart.item?.currentAddress }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import { computed } from 'vue'

const cartDateInfo = computed(() => {
  return `${cartRepo.item?.currentDeliveryType}`
})

const openDialog = () => {
  if (!authentication.user) {
    store.authModal = true
    return
  }
  if (!companyGroupRepo.item) return
  store.cartDrawer = false
  if (companyGroupRepo.item?.companies.length > 1) {
    store.selectCompanyModal = true
  } else {
    store.serviceSettingsModal = true
  }
}
</script>
