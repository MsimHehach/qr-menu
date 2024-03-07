<template>
  <div class="fixed-bottom">
    <div
      v-if="$cart.item?.cartItems.length"
      class="row full-width justify-center mb-3"
    >
      <CButton
        style="min-width: 200px"
        height="44px"
        @click="$store.cartDrawer = true"
        :label="
          'Корзина ' +
          beautifyNumber($cart.item.discountedTotalSum, true) +
          ' ₽'
        "
      />
    </div>
    <div
      class="bordered row justify-between no-wrap full-width items-center bg-bottom-menu-color pa-5 pr-10"
      style="z-index: 3005"
    >
      <CButton
        class="col-grow"
        style="max-width: 220px"
        :color="
          $waiterCall.item?.status === WaiterCallStatus.CREATED ||
          $waiterCall.item?.status === WaiterCallStatus.WAITING
            ? 'secondary-button-color'
            : 'button-color'
        "
        @click="callButtonClickHandler()"
        :loading="$waiterCall.loadings.create || setStatusLoading"
        height="50px"
      >
        <div
          :class="
            $waiterCall.item?.status === WaiterCallStatus.CREATED ||
            $waiterCall.item?.status === WaiterCallStatus.WAITING
              ? 'text-on-secondary-button-color'
              : 'text-on-button-color'
          "
          class="row no-wrap gap-6 items-center"
        >
          <template
            v-if="
              $waiterCall.item?.status === WaiterCallStatus.CREATED ||
              $waiterCall.item?.status === WaiterCallStatus.WAITING
            "
          >
            <CIcon
              color="on-secondary-button-color"
              name="fa-light fa-bell-slash"
              size="22px"
            />
            <div
              style="line-height: 16px"
              class="column items-start bottom-bar-text"
            >
              <div>Отменить</div>
              <div>вызов</div>
            </div>
          </template>
          <template
            v-else-if="$waiterCall.item?.status === WaiterCallStatus.ACCEPTED"
          >
            <CIcon
              color="on-button-color"
              name="fa-light fa-bell-on"
              size="22px"
            />
            <div
              style="line-height: 16px"
              class="column items-start bottom-bar-text"
            >
              <div>Завершить</div>
              <div>вызов</div>
            </div>
          </template>
          <template v-else>
            <CIcon
              color="on-button-color"
              name="fa-light fa-bell-on"
              size="22px"
            />
            <div
              style="line-height: 16px"
              class="column items-start bottom-bar-text"
            >
              <div>Вызвать</div>
              <div>официанта</div>
            </div>
          </template>
        </div>
      </CButton>

      <CButton
        @click="
          $router.push({
            name: 'qrHome',
          })
        "
        text-color="on-bottom-menu-color"
        color="transparent"
        height="50px"
        width="58px"
      >
        <div
          style="line-height: 8px"
          class="column no-wrap gap-3 bottom-bar-text"
        >
          <CIcon
            color="on-bottom-menu-color"
            size="22px"
            name="fa-light fa-pot-food"
          />
          <div>Меню</div>
        </div>
      </CButton>
      <CButton
        @click="
          $order.item
            ? $router.push({
                name: 'currentOrderPage',
              })
            : void 0
        "
        :style="$order.item ? '' : 'cursor: not-allowed'"
        :text-color="
          $order.item ? 'on-bottom-menu-color' : 'secondary-button-color'
        "
        color="transparent"
        height="50px"
        width="62px"
      >
        <div
          style="line-height: 8px"
          class="column no-wrap gap-3 bottom-bar-text"
        >
          <CIcon
            :color="
              $order.item ? 'on-bottom-menu-color' : 'secondary-button-color'
            "
            size="23px"
            name="fa-light fa-clipboard-list-check"
          />
          <div>Мой счет</div>
        </div>
      </CButton>
    </div>
  </div>
  <WaiterCallSuccessfullyCreated v-model="callCreatedModal" />
</template>

<script setup lang="ts">
import { Notify } from 'quasar'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import {
  WaiterCall,
  WaiterCallStatus,
} from 'src/models/customer/waiterCall/waiterCall'
import { waiterCallRepo } from 'src/models/customer/waiterCall/waiterCallRepo'
import { padRepo } from 'src/models/pads/padRepo'
import { beautifyNumber } from 'src/models/store'
import { ref } from 'vue'
import WaiterCallSuccessfullyCreated from './WaiterCallSuccessfullyCreated.vue'

const callCreatedModal = ref(false)
const setStatusLoading = ref(false)

const callButtonClickHandler = async () => {
  if (
    waiterCallRepo.item?.status === WaiterCallStatus.CREATED ||
    waiterCallRepo.item?.status === WaiterCallStatus.WAITING
  ) {
    await callSetStatus(WaiterCallStatus.DECLINED)
  } else if (waiterCallRepo.item?.status === WaiterCallStatus.ACCEPTED) {
    await callSetStatus(WaiterCallStatus.CLOSED)
  } else {
    await createCall()
  }
}

const callSetStatus = async (status: WaiterCallStatus) => {
  try {
    if (!waiterCallRepo.item) throw 'Errow'
    setStatusLoading.value = true
    await waiterCallRepo.setStatus(waiterCallRepo.item.id || '', status)
    setStatusLoading.value = false
  } catch {
    Notify.create({
      message: 'Ошибка при смене статуса',
      color: 'danger',
    })
  }
}

const createCall = async () => {
  try {
    const newCall = new WaiterCall({
      sales_point: padRepo.item?.salesPoint?.id || null,
      pad: padRepo.item?.id || null,
    })
    await waiterCallRepo.create(newCall)
    callCreatedModal.value = true
  } catch {
    Notify.create({
      message: 'Невозможно позвать официанта в данный момент',
      color: 'danger',
    })
  }
}
</script>

<style lang="scss" scoped>
.bordered {
  border-top: 1px solid var(--divider-color);
}
</style>
