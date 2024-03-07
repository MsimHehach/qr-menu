<template>
  <div
    @click="openDialog()"
    class="row no-wrap justify-between items-center cursor-pointer button bg-product-tile-color px-8 col"
    :style="`height: ${$q.screen.lt.md ? '42' : '44'}px`"
  >
    <div
      class="row no-wrap gap-4 body items-center text-on-product-tile-color"
      style="overflow: hidden"
    >
      <div
        v-if="!$cart.item"
        class="row no-wrap gap-4 items-center"
        style="overflow: inherit"
      >
        <!-- <CustomIcon width="28px" height="28px" name="bagOnTime.svg" /> -->
        <CIcon
          name="fa-regular fa-bag-shopping"
          color="on-product-tile-color"
          size="22px"
        />
        <div style="line-height: 15px" class="bold nowrap-content">
          {{
            $q.screen.lt.lg ? 'Способ получения' : 'Выберите способ получения'
          }}
        </div>
      </div>
      <template v-else>
        <div class="row no-wrap gap-md-4 gap-xs-2 items-center">
          <!-- <CustomIcon width="28px" height="28px" name="bagOnTime.svg" /> -->
          <CIcon
            name="fa-regular fa-bag-shopping"
            color="on-product-tile-color"
            size="22px"
          />
          <div class="bold text-primary">
            {{ $cart.item.currentDeliveryType }}
          </div>
        </div>
        <div
          class="row no-wrap gap-4 items-center"
          style="overflow: inherit !important"
        >
          <div class="rounded-separator"></div>
          <div class="nowrap-content">
            {{ $cart.item.currentAddress }}
          </div>
        </div>
      </template>
    </div>
    <CIcon
      size="22px"
      color="on-product-tile-color"
      name="fa-regular fa-angle-right"
    />
  </div>
</template>
<script lang="ts" setup>
import { companyGroupRepo } from 'src/models/companyGroup/companyGroupRepo'
import { store } from 'src/models/store'
import CIcon from '../template/helpers/CIcon.vue'
// import CustomIcon from '../template/helpers/CustomIcon.vue'
import { authentication } from 'src/models/authentication/authentication'

const openDialog = () => {
  if (!authentication.user) {
    store.authModal = true
    return
  }
  if (!companyGroupRepo.item) return
  if (companyGroupRepo.item?.companies.length > 1) {
    store.selectCompanyModal = true
  } else {
    store.serviceSettingsModal = true
  }
}
</script>

<style lang="scss" scoped>
.button {
  border-radius: 100px !important;
  max-width: 430px;
  border: 1px solid var(--secondary);
  // width: inherit;
  // width: 100% !important;
}

.rounded-separator {
  width: 4px;
  height: 4px;
  min-width: 4px;
  max-width: 4px;
  background-color: var(--on-background-color);
  border-radius: 50%;
}

.nowrap-content {
  white-space: nowrap;
  overflow: hidden;
  width: fit-content;
  text-overflow: ellipsis;
  // text-size-adjust: 10%;
}
</style>
