<template>
  <div>
    <q-drawer
      side="right"
      style="z-index: 999999; height: 100%"
      :style="`border-radius: ${$q.screen.xs ? '' : drawerBorderRadius}`"
      overlay
      v-model="$store.cartDrawer"
      no-swipe-open
      behavior="mobile"
      :width="$q.screen.xs ? $q.screen.width : 474"
      class="column full-height no-wrap justify-between bg-background-color text-on-background-color"
    >
      <div class="column pb-20">
        <div
          style="height: 60px"
          class="row no-wrap items-center bg-modal-header-color text-on-modal-header-color px-10 justify-between mb-10"
        >
          <div class="row items-center no-wrap gap-5">
            <div
              @click="toPreviousStep()"
              class="bg-white-opacity cursor-pointer box-shadow py-4 px-5 border-radius"
            >
              <CIcon
                hover-color="primary"
                color="on-secondary-button-color"
                name="fa-light fa-angle-left"
              />
            </div>
            <!-- <CIconButton
              icon="fa-light fa-angle-left"
              color="secondary-button-color"
              icon-color="on-secondary-button-color"
              size="37"
              @click="toPreviousStep()"
            /> -->
            <div class="header3">
              {{ cartMode === 'cart' ? 'Корзина' : 'Итого' }}
            </div>
          </div>
          <div class="row gap-5">
            <CIconButton
              v-if="$cart.item?.cartItems.length"
              size="38px"
              icon-class="box-shadow"
              icon="fa-light fa-trash-alt"
              icon-color="on-secondary-button-color"
              color="white-opacity"
              @click="acceptModal = true"
            />

            <div class="bg-white-opacity box-shadow py-4 px-5 border-radius">
              <CIcon
                color="on-secondary-button-color"
                name="fa-light fa-shopping-cart"
              />
            </div>
          </div>
        </div>
        <template v-if="$cart.item?.cartItems.length">
          <div v-if="cartMode === 'cart'" class="column px-10">
            <template
              v-for="(item, index) in $cart.item?.cartItems"
              :key="index"
            >
              <q-separator v-if="index" class="my-5" color="divider-color" />
              <CartDrawerItemRow @delete="deleteCartItem(item)" :item="item" />
            </template>
            <div
              class="row box-shadow border-radius bg-background-color pa-10 mt-15 justify-between items-center"
            >
              <div class="row gap-5 items-center no-wrap">
                <div
                  class="py-4 px-5 box-shadow border-radius bg-white-opacity"
                >
                  <CIcon color="primary" name="fa-light fa-credit-card-blank" />
                </div>
                <div class="text-primary body">К оплате</div>
              </div>
              <div class="text-primary body">
                {{ $cart.item?.discountedTotalSum }} ₽
              </div>
            </div>
          </div>
          <CartOutput
            v-else
            @payment-selected="makeAnOrder($event)"
            :show-payment-types="selectPaymentType"
          />
        </template>
        <div v-else class="px-10">Корзина пуста</div>
      </div>
      <div
        v-if="$cart.item?.cartItems.length && !selectPaymentType"
        class="row full-width justify-center bg-background-color py-8"
        style="position: sticky; bottom: 0"
      >
        <CButton
          @click="toNextStep()"
          :loading="cartRepo.loading"
          class="body"
          :disable="!isArrangeDisabled"
          height="50px"
          style="min-width: 261px"
          >{{ `Оформить заказ ${$cart.item?.discountedTotalSum} ₽` }}</CButton
        >
      </div>
    </q-drawer>
  </div>
  <AcceptModal
    :model-value="acceptModal"
    @update:model-value="acceptModal = false"
    @accept="clearCart()"
  />
</template>
<script lang="ts" setup>
import CartDrawerItemRow from 'src/components/rows/CartDrawerItemRow.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { store } from 'src/models/store'
import { ref, computed, watch } from 'vue'
import CartOutput from './CartOutput.vue'
import { uiSettingsRepo } from 'src/models/uiSettings/uiSettingsRepo'
import { cartRepo } from 'src/models/carts/cartRepo'
import moment from 'moment'
import { Notify } from 'quasar'
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import { PaymentType } from 'src/models/order/order'
import CIconButton from 'src/components/template/buttons/CIconButton.vue'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'

const cartMode = ref<'cart' | 'output'>('cart')

const selectPaymentType = ref(false)

const acceptModal = ref(false)

const drawerBorderRadius = computed(() => {
  return `${uiSettingsRepo.item?.borderRadius}px 0 0 ${uiSettingsRepo.item?.borderRadius}px !important`
})

const isArrangeDisabled = computed(() => {
  return (
    cartMode.value === 'cart' ||
    (cartRepo.item?.deliveryTime && cartRepo.item.cartItems.length)
  )
})

watch(
  () => store.cartDrawer,
  (v) => {
    if (v) {
      selectPaymentType.value = false
    }
  }
)

const clearCart = async () => {
  try {
    await cartRepo.clear()
    Notify.create({
      message: 'Корзина очищена',
    })
  } catch {
    Notify.create({
      message: 'Ошибка при очистке корзины',
      color: 'danger',
    })
  }
}

const deleteCartItem = async (item: CartItem) => {
  try {
    await cartItemRepo.delete(item)
    Notify.create({
      message: 'Блюдо удалено из корзины',
    })
    await cartRepo.current()
    const foundIndex = cartRepo.item?.cartItems.findIndex(
      (v) => v.id === item.id
    )
    if (foundIndex !== undefined && foundIndex > -1)
      cartRepo.item?.cartItems.splice(foundIndex, 1)
  } catch {
    Notify.create({
      message: 'Ошибка при удалении',
      color: 'danger',
    })
  }
}

const toNextStep = async () => {
  if (cartMode.value === 'cart') {
    cartMode.value = 'output'
  } else {
    await selectDeliveryDate()
    selectPaymentType.value = true
  }
}

const selectDeliveryDate = async () => {
  try {
    cartRepo.loading = true
    await cartRepo.setParams({
      delivery_time: cartRepo.item?.deliveryTime
        ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        : undefined,
      sales_point: cartRepo.item?.salesPoint.id || '',
      type: cartRepo.item?.type || '',
    })
    cartRepo.loading = false
  } catch {
    Notify.create({
      message: 'Ошибка при установке даты доставки',
      color: 'danger',
    })
    cartRepo.loading = false
  }
}

const makeAnOrder = async (paymentType: PaymentType) => {
  try {
    const order = await cartRepo.arrange({
      sales_point: cartRepo.item?.salesPoint.id,
      payment_data: {
        type: paymentType,
        payment_service:
          paymentType === PaymentType.CASH
            ? undefined
            : paymentType === PaymentType.CARD
            ? 'card'
            : 'web_form',
      },
    })
    cartMode.value = 'cart'
    cartRepo.item = null
    if (order.paymentUrl) {
      window.open(order.paymentUrl, '_blank')
    }
    Notify.create({
      message: 'Заказ успешно оформлен',
    })
    cartRepo.item = null
    // await cartRepo.current(order.salesPoint.id)
  } catch {
    cartRepo.arrangeLoading = false
    Notify.create({
      message: 'Ошибка при оформлении заказа',
      color: 'danger',
    })
  }
}

const toPreviousStep = () => {
  if (cartMode.value === 'output') {
    cartMode.value = 'cart'
  } else {
    store.cartDrawer = false
  }
}
</script>

<style lang="scss" scoped></style>
