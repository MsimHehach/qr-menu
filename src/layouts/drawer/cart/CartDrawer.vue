<template>
  <div>
    <q-drawer
      side="right"
      style="z-index: 999999; height: 100%"
      overlay
      v-model="$store.cartDrawer"
      no-swipe-open
      behavior="mobile"
      :width="$q.screen.lt.lg ? $q.screen.width : 581"
      class="column full-height no-wrap justify-between bg-background-color text-on-background-color"
    >
      <CIcon
        v-if="$q.screen.gt.md"
        @click="$store.cartDrawer = false"
        size="37px"
        style="position: absolute; top: 40px; left: -50px"
        name="fa-light fa-xmark"
        hover-color="primary"
        class="cursor-pointer"
        color="white"
      />
      <div class="column pb-20">
        <div
          class="row no-wrap items-center text-on-background-color px-md-15 px-xs-8 justify-between pt-md-15 pb-md-11 py-md-0 py-xs-10"
        >
          <div class="row items-center no-wrap gap-md-5 gap-xs-4 header3 bold">
            <CIcon
              v-if="$q.screen.lt.lg"
              @click="$store.cartDrawer = false"
              name="fa-regular fa-angle-left"
              size="22px"
              color="on-background-color"
              hover-color="primary"
              class="cursor-pointer mb-1"
            />
            <div class="bold">
              {{ $q.screen.gt.sm ? 'Ваша корзина' : 'Корзина' }}
            </div>
            <template v-if="$q.screen.gt.sm">
              <div
                style="width: 5px; height: 5px; border-radius: 50%"
                class="bg-primary"
              ></div>
              <div class="bold">{{ $cart.item?.sum || 0 }}₽</div>
            </template>
          </div>
          <template v-if="$q.screen.gt.sm">
            <CButton
              v-if="$cart.item?.cartItems.length"
              @click="acceptModal = true"
              label="Очистить"
              class="subtitle-text"
              text-button
              text-color="primary"
            />
          </template>
          <CIcon
            v-else
            @click="acceptModal = true"
            name="fa-regular fa-trash-alt"
            size="22px"
            color="on-background-color"
            hover-color="primary"
            class="cursor-pointer"
          />
        </div>
        <q-separator
          v-if="$q.screen.gt.sm"
          class="mb-15"
          color="divider-color"
        />

        <div class="column full-width px-md-15 px-xs-8">
          <CartDeliveryInfo v-if="$cart.item" class="mb-md-15 mb-xs-10" />
          <template v-if="$cart.item?.cartItems.length">
            <div class="column">
              <template
                v-for="(item, index) in $cart.item?.cartItems.filter(
                  (v) => !v.attachedTo,
                )"
                :key="index"
              >
                <q-separator
                  v-if="index"
                  class="my-md-10 my-xs-8"
                  color="divider-color"
                />
                <CartDrawerItemRow
                  @delete="deleteCartItem(item)"
                  :item="item"
                />
              </template>
            </div>
          </template>
          <div v-else class="subtitle-text">Корзина пуста</div>
        </div>
      </div>

      <div
        v-if="$cart.item?.cartItems.length || $cart.arrangeLoading"
        class="row full-width justify-center bg-background-color px-15 py-13"
        style="position: sticky; bottom: 0"
      >
        <!-- <q-separator color="divider-color" class="mb-12 full-width" /> -->
        <CartBonuses
          v-if="$cart.item?.walletPayments.length"
          class="mb-md-12 mb-xs-8"
        />
        <div
          v-if="
            $salesPoint.item?.settings.promo_codes !== PromoCodeMode.DISABLED
          "
          class="row full-width justify-center mb-md-12 mb-xs-8"
        >
          <CButton
            @click="promocodeModal = true"
            label="У меня есть промокод"
            class="body"
            :style="`background-color: ${lightColor(
              $uiSettings.item?.primaryColor.color || '000',
              '27',
            )} !important`"
            height="40px"
            text-color="primary"
          />
        </div>
        <CartTotalInfo />
        <div
          @click="arrange"
          class="border-radius2 row items-center px-10 subtitle-text mt-10"
          :style="`height: ${$q.screen.lt.md ? '40' : '52'}px; width: 100%; ${
            isAddToCardDisabled ? 'cursor: not-allowed' : ''
          }`"
          :class="[
            $q.screen.gt.sm ? 'justify-between' : 'justify-center',
            isAddToCardDisabled
              ? 'bg-secondary-button-color text-on-secondary-button-color'
              : 'bg-button-color text-on-button-color cursor-pointer',
          ]"
        >
          <div
            class="row justify-center full-width"
            v-if="cartRepo.loading || $cart.arrangeLoading || loading"
          >
            <q-spinner size="28px" />
          </div>
          <template v-else>
            <CTooltip v-if="isAddToCardDisabled"
              >Имеются недоступные позиции</CTooltip
            >
            <div>Оформить заказ</div>
            <q-badge
              v-if="$q.screen.gt.sm"
              style="
                border-radius: 8px;
                backdrop-filter: blur(5px);
                background-color: rgba(0, 0, 0, 0.1);
              "
              class="subtitle-text py-3 px-5"
              :class="{
                'text-on-secondary-button-color': isAddToCardDisabled,
              }"
              >{{
                $cart.item?.discountedTotalSum
                  ? beautifyNumber($cart.item?.discountedTotalSum, true) + ' ₽'
                  : '-'
              }}
            </q-badge>
          </template>
        </div>
      </div>
    </q-drawer>
  </div>
  <AcceptModal
    :model-value="acceptModal"
    @update:model-value="acceptModal = false"
    @accept="clearCart()"
    text="Вы точно хотите очистить корзину"
  >
  </AcceptModal>
  <PromocodeModal v-model="promocodeModal" />
</template>
<script lang="ts" setup>
import CartDrawerItemRow from 'src/components/rows/CartDrawerItemRow.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { beautifyNumber, lightColor, store } from 'src/models/store'
import { ref, watch, computed } from 'vue'
import { cartRepo } from 'src/models/carts/cartRepo'
import { Notify } from 'quasar'
import { CartItem } from 'src/models/carts/cartItem/cartItem'
import { cartItemRepo } from 'src/models/carts/cartItem/cartItemRepo'
import AcceptModal from 'src/components/dialogs/AcceptModal.vue'
import CartDeliveryInfo from './CartDeliveryInfo.vue'
import CartTotalInfo from './CartTotalInfo.vue'
import { useRouter } from 'vue-router'
import CartBonuses from './CartBonuses.vue'
import { PromoCodeMode } from 'src/models/salesPoint/salesPoint'
import PromocodeModal from 'src/pages/arrangement/PromocodeModal.vue'
import CTooltip from 'src/components/helpers/CTooltip.vue'

const selectPaymentType = ref(false)

const acceptModal = ref(false)

const router = useRouter()

const loading = ref(false)

const promocodeModal = ref(false)

watch(
  () => store.cartDrawer,
  (v) => {
    if (v) {
      selectPaymentType.value = false
    }
  },
)

const isAddToCardDisabled = computed(() => {
  return cartRepo.item?.cartItems.some(
    (v) =>
      v.availableQuantity !== null &&
      (v.availableQuantity <= 0 || v.availableQuantity < v.quantity),
  )
})

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
      (v) => v.id === item.id,
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

const applyBonuses = () => {
  if (cartRepo.item?.walletPayments.some((v) => v.applied_sum)) {
    void cartRepo.setParams({
      sales_point: cartRepo.item?.salesPoint?.id,
      type: cartRepo.item?.type || undefined,
      applied_wallet_payments: [
        {
          wallet_payment: cartRepo.item.walletPayments[0].uuid,
          applied_sum: cartRepo.item.walletPayments[0].applied_sum,
        },
      ],
    })
  }
}

const arrange = () => {
  if (isAddToCardDisabled.value) return
  applyBonuses()
  void router.push({
    name: 'arrangementPage',
  })
}

// const makeAnOrder = async () => {
//   try {
//     loading.value = true
//     const status = await salesPointRepo.status(cartRepo.item?.salesPoint.id)
//     if (!status) {
//       Notify.create({
//         message: 'В данный момент невозможно оформить заказ',
//         color: 'danger',
//       })
//       return
//     }
//     const order = await cartRepo.arrange({
//       sales_point: cartRepo.item?.salesPoint.id,
//       payment_data: {
//         type: currentPaymentType.value,
//         payment_service:
//           currentPaymentType.value === PaymentType.CASH ||
//           currentPaymentType.value === PaymentType.PAY_LATER
//             ? undefined
//             : currentPaymentType.value === PaymentType.CARD
//             ? 'card'
//             : 'web_form',
//       },
//       pad: store.tableMode ? padRepo.item?.id : undefined,
//     })
//     cartMode.value = 'cart'
//     if (store.tableMode) {
//       await cartRepo.current(
//         padRepo.item?.salesPoint?.id,
//         padRepo.item || undefined
//       )
//       void router.push({
//         name: 'currentOrderPage',
//       })
//     } else {
//       cartRepo.item = null
//     }
//     if (order.paymentUrl) {
//       window.open(order.paymentUrl, '_blank')
//     }
//     Notify.create({
//       message: 'Заказ успешно оформлен',
//     })
//     orderRepo.item = order
//   } catch {
//     cartRepo.arrangeLoading = false
//     Notify.create({
//       message: 'Ошибка при оформлении заказа',
//       color: 'danger',
//     })
//   } finally {
//     loading.value = false
//   }
// }

// const toPreviousStep = () => {
//   if (cartMode.value === 'output') {
//     cartMode.value = 'cart'
//   } else {
//     store.cartDrawer = false
//   }
// }
</script>

<style lang="scss" scoped></style>
