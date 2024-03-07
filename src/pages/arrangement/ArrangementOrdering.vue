<template>
  <div v-if="$cart.item">
    <div class="row pt-lg-20 pt-xs-12 text-on-background-color">
      <div class="col-lg col-xs-12 column">
        <div
          class="row full-width items-center no-wrap gap-4 mb-md-12 mb-xs-10"
        >
          <CIcon
            v-if="$q.screen.lt.md"
            @click="
              $router.push({
                name: 'home',
              })
            "
            name="fa-regular fa-angle-left"
            size="24px"
            color="on-background-color"
            hover-color="primary"
            class="cursor-pointer"
          />
          <div class="header bold">
            Заказ на
            {{ isDelivery ? 'доставку' : 'самовывоз' }}
          </div>
        </div>
        <div class="column gap-md-12 gap-xs-8 full-width">
          <div
            v-if="$q.screen.lt.md"
            class="full-width mb-2"
            ref="timeBlockMobileSpot"
          ></div>

          <div
            :class="$q.screen.lt.md ? 'column' : 'row items-center'"
            class="body full-width gap-md-5 gap-xs-4"
          >
            <div v-if="$q.screen.gt.sm" class="col-4">
              Адрес {{ isDelivery ? 'доставки' : 'самовывоза' }}
            </div>
            <div v-else class="row items-center full-width gap-3 no-wrap">
              <CIcon color="on-background-color" name="fa-regular fa-home" />
              <div class="body bold mt-2">Адрес</div>
            </div>
            <div
              :style="
                $uiSettings.item?.inputType === 'outlined'
                  ? 'border: 1px #ededed solid'
                  : ''
              "
              style="min-height: 48px"
              class="bg-input-color border-radius2 text-on-input-color row justify-between px-6 py-5 row no-wrap col gap-10"
            >
              <div>{{ $cart.item?.currentAddress }}</div>
              <template v-if="isDelivery">
                <CButton
                  v-if="$q.screen.gt.sm"
                  @click="deliveryAddressesModal = true"
                  text-button
                  label="Изменить"
                  class="body pr-5"
                  text-color="primary"
                />
                <CIcon
                  v-else
                  @click="deliveryAddressesModal = true"
                  name="fa-regular fa-angle-right"
                  size="24px"
                  color="on-input-color"
                  hover-color="primary"
                  class="cursor-pointer"
                />
              </template>
            </div>
          </div>
          <teleport
            :disabled="$q.screen.gt.sm || !timeBlockMobileSpot"
            :to="timeBlockMobileSpot"
          >
            <div
              :class="$q.screen.lt.md ? 'column' : 'row items-center'"
              class="body full-width gap-5"
            >
              <div v-if="$q.screen.gt.sm" class="col-4">Время доставки</div>
              <div
                :class="$q.screen.lt.md ? 'full-width' : 'col'"
                class="row gap-md-8 gap-xs-6 text-on-input-color"
              >
                <div
                  :style="
                    $uiSettings.item?.inputType === 'outlined'
                      ? 'border: 1px #ededed solid'
                      : ''
                  "
                  :class="[
                    !$cart.item.deliveryTime
                      ? 'selected-element'
                      : { 'bordered-block': $q.screen.lt.md },
                    $q.screen.lt.md
                      ? 'column gap-8'
                      : 'row justify-between  items-center gap-10',
                  ]"
                  style="min-height: 48px; height: inherit"
                  @click="selectClosestTime()"
                  class="border-radius2 cursor-pointer bg-input-color px-6 py-5 row no-wrap col"
                >
                  <template v-if="$q.screen.gt.sm">
                    <div>Ближайшая</div>
                    <CIcon
                      class="cursor-pointer"
                      name="fa-regular fa-clock"
                      color="secondary"
                      size="20px"
                    />
                  </template>
                  <template v-else>
                    <RoundedSelector
                      height="24px"
                      width="24px"
                      :model-value="!$cart.item.deliveryTime"
                      check
                    />
                    <div class="column full-width gap-2">
                      <div class="bold body">Как можно скорее</div>
                      <div class="body">
                        <span class="bold body">~</span>через 10 минут
                      </div>
                    </div>
                  </template>
                </div>

                <div
                  v-if="
                    !$salesPoint.item?.settings
                      .allow_order_arrangement_without_delivery_time &&
                    (availableHours?.today.length ||
                      availableHours?.tomorrow.length)
                  "
                  :style="
                    $uiSettings.item?.inputType === 'outlined'
                      ? 'border: 1px #ededed solid'
                      : ''
                  "
                  style="min-height: 48px; height: inherit"
                  :class="[
                    $cart.item.deliveryTime
                      ? 'selected-element'
                      : { 'bordered-block': $q.screen.lt.md },
                    $q.screen.lt.md
                      ? 'column gap-8'
                      : 'row justify-between items-center  gap-10',
                  ]"
                  class="border-radius2 cursor-pointer bg-input-color px-6 py-5 no-wrap col"
                >
                  <template v-if="$q.screen.gt.sm">
                    <div>{{ $cart.item.deliveryTime || 'Ко времени' }}</div>
                    <CIcon
                      class="cursor-pointer"
                      name="fa-regular fa-calendar-clock"
                      color="secondary"
                      size="20px"
                    />
                  </template>
                  <template v-else>
                    <RoundedSelector
                      height="24px"
                      width="24px"
                      :model-value="!!$cart.item.deliveryTime"
                      check
                    />
                    <div class="column full-width gap-2">
                      <div class="bold body">Ко времени</div>
                      <div class="body">Выберите время</div>
                    </div>
                  </template>
                  <q-menu
                    v-model="menu"
                    :fit="$q.screen.gt.sm"
                    class="pa-6"
                    :style="`width: ${$q.screen.lt.md ? '250px' : ''}`"
                    style="overflow-y: hidden"
                  >
                    <TabPicker
                      :model-value="currentDay"
                      @update-tab="currentDay = $event"
                      :tabs="['Сегодня', 'Завтра']"
                    />
                    <div
                      ref="menuRef"
                      class="column no-wrap full-width"
                      style="
                        overflow-y: scroll;
                        max-height: 450px;
                        height: 100%;
                      "
                    >
                      <div
                        v-for="(el, index) in totalDayTimes()"
                        :class="[
                          el,
                          {
                            'bold selected-time border-radius2':
                              el === $cart.item.deliveryTime?.slice(11, 16),
                          },
                        ]"
                        :key="index"
                        @click="setDeliveryTime(el)"
                        :style="
                          !availableTimes?.includes(el)
                            ? 'opacity: 0.5; cursor: not-allowed !important'
                            : ''
                        "
                        class="full-width body cursor-pointer pa-6 time-row"
                      >
                        {{ el }}
                      </div>
                    </div>
                  </q-menu>
                </div>
              </div>
            </div>
          </teleport>
          <q-separator v-if="$q.screen.lt.md" color="divider-color" />
          <div
            :class="$q.screen.lt.md ? 'column' : 'row'"
            class="body full-width gap-md-5 gap-xs-4"
          >
            <div :class="{ bold: $q.screen.lt.md }" class="col-md-4 mt-md-8">
              {{ $q.screen.lt.md ? 'Комментарий к заказу' : 'Комментарий' }}
            </div>
            <CInput
              auto-grow
              height="fit-content"
              class="col"
              placeholder="Напишите ваши пожелания"
              v-model="$cart.item.comment"
            />
          </div>
          <q-separator v-if="$q.screen.lt.md" color="divider-color" />

          <div
            :class="$q.screen.lt.md ? 'column' : 'row items-center'"
            class="body full-width gap-md-5 gap-xs-4"
          >
            <div :class="{ bold: $q.screen.lt.md }" class="col-md-4">
              Способ оплаты
            </div>
            <div
              :style="
                $uiSettings.item?.inputType === 'outlined'
                  ? 'border: 1px #ededed solid'
                  : ''
              "
              style="min-height: 48px"
              class="body border-radius2 bg-input-color text-on-input-color row justify-between items-center px-6 py-5 row no-wrap col gap-10"
            >
              <div class="gap-4 row items-center no-wrap">
                <q-icon size="20px" :name="selectedPaymentType?.icon" />
                {{ selectedPaymentType?.label }}
              </div>
              <CButton
                v-if="$q.screen.gt.sm"
                @click="selectedPaymentTypeModal = true"
                text-button
                label="Изменить"
                class="body pr-5"
                text-color="primary"
              />
              <CIcon
                v-else
                @click="selectedPaymentTypeModal = true"
                name="fa-regular fa-angle-right"
                size="24px"
                color="on-input-color"
                hover-color="primary"
                class="cursor-pointer"
              />
            </div>
          </div>

          <!-- <div
            v-if="
              $salesPoint.item?.settings.promo_codes !== PromoCodeMode.DISABLED
            "
            class="row full-width justify-center"
          >
            <CButton
              @click="promocodeModal = true"
              text-button
              label="У меня есть промокод"
              class="body"
              style="opacity: 0.9"
              text-color="on-background-color"
            />
          </div> -->
        </div>
        <div v-if="$q.screen.gt.md" class="row full-width gap-10 mt-25">
          <CButton
            @click="
              $router.push({
                name: 'home',
              })
            "
            label="Назад"
            height="48px"
            class="col body"
            color="secondary-button-color"
            text-color="on-secondary-button-color"
          />
          <CButton
            @click="makeAnOrder()"
            :loading="loading"
            :disabled="!isArrangeAvailable"
            label="Оформить"
            :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
            class="col body"
          />
        </div>
      </div>
      <div
        v-if="$q.screen.gt.sm"
        class="pl-lg-30 col-lg-5 col-xs-12 mt-xs-20 mt-lg-0 pb-xs-20 pb-lg-0"
      >
        <div
          :style="
            $companyGroup.item?.externalId === 'corex_demo'
              ? 'border: 1px #f5f5f5 solid'
              : ''
          "
          :class="{ 'box-shadow': $q.screen.gt.md }"
          class="column full-width border-radius gap-6 px-lg-8 py-lg-10 pa-xs-10"
        >
          <div style="opacity: 0.8" class="subtitle-text mb-2">
            Состав заказа
          </div>
          <template v-for="(item, index) in $cart.item?.cartItems" :key="index">
            <div class="row body full-width no-wrap py-3">
              <div class="row no-wrap gap-6 col-10 items-center">
                <q-img
                  :src="item.size.image?.thumbnail || $store.images.empty"
                  :height="
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  "
                  :width="
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  "
                  :style="`min-width: ${
                    $q.screen.gt.md ? '65px' : $q.screen.md ? '60px' : '55px'
                  }`"
                  fit="cover"
                  class="border-radius"
                  :class="{ dimmed: item.isDead }"
                >
                  <template v-slot:error>
                    <span>
                      <q-img
                        class="user-image"
                        fit="cover"
                        :style="`min-width: ${
                          $q.screen.gt.md
                            ? '65px'
                            : $q.screen.md
                              ? '60px'
                              : '55px'
                        }`"
                        :width="
                          $q.screen.gt.md
                            ? '65px'
                            : $q.screen.md
                              ? '60px'
                              : '55px'
                        "
                        :height="
                          $q.screen.gt.md
                            ? '65px'
                            : $q.screen.md
                              ? '60px'
                              : '55px'
                        "
                        :src="$store.images.empty"
                      ></q-img>
                    </span>
                  </template>
                </q-img>
                <div class="column gap-1">
                  <div class="ellipsis-2-lines">
                    {{ item.size.name }}
                  </div>
                  <div style="opacity: 0.6">{{ item.quantity }} шт</div>
                </div>
              </div>
              <div
                class="col-2 column items-end no-wrap"
                style="white-space: no-wrap"
              >
                <div
                  v-if="item.totalSum !== item.discountedTotalSum"
                  style="opacity: 0.5"
                  class="text-strike"
                >
                  {{ beautifyNumber(item.totalSum, true) }} ₽
                </div>
                <div>{{ beautifyNumber(item.discountedTotalSum, true) }} ₽</div>
              </div>
            </div>
          </template>
          <q-separator color="divider-color" />
          <div class="row full-width justify-between">
            <div class="body bold">Сумма заказа</div>

            <div class="body bold">
              {{ beautifyNumber($cart.item?.totalSum, true) }} ₽
            </div>
          </div>
          <div
            v-if="$cart.item?.appliedBonuses"
            class="row full-width justify-between text-primary"
          >
            <div class="body bold">Списано бонусов</div>
            <div class="body bold">
              -{{ beautifyNumber($cart.item?.appliedBonuses, true) }} ₽
            </div>
          </div>
          <div
            v-if="$cart.item.type === CartType.DELIVERY"
            class="row full-width justify-between"
          >
            <div class="body bold">Стоимость доставки</div>
            <div class="body bold">
              {{ beautifyNumber($cart.item?.deliveryPrice, true) }} ₽
            </div>
          </div>
          <div class="row full-width justify-between">
            <div class="body bold">К оплате</div>
            <div class="body bold">
              {{ beautifyNumber($cart.item?.discountedTotalSum, true) }} ₽
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="$q.screen.lt.lg"
      class="full-width bg-background-color mt-xs-20"
      style="position: sticky; bottom: 0; left: 0"
    >
      <q-separator color="divider-color" class="full-width" />
      <div
        class="row full-width gap-md-10 gap-xs-8 no-wrap py-md-15 py-xs-8 items-center text-on-background-color"
      >
        <div v-if="$q.screen.gt.sm" class="header3 bold px-md-20 px-xs-10">
          Сумма {{ beautifyNumber($cart.item?.discountedTotalSum, true) }} ₽
        </div>
        <div v-else class="column pl-5">
          <div class="header3 bold">
            {{ beautifyNumber($cart.item?.discountedTotalSum, true) }} ₽
          </div>
          <div>
            {{ mobileViewSelectedTime }}
          </div>
        </div>
        <CButton
          :label="$q.screen.lt.md ? 'Оформить заказ' : 'Оплатить'"
          :height="$q.screen.md ? '44px' : $q.screen.lt.md ? '40px' : '48px'"
          class="col-grow body"
          @click="makeAnOrder()"
          :loading="loading"
          :disabled="!isArrangeAvailable"
        />
      </div>
    </div>
  </div>
  <div v-else class="pt-20 header3 bold">Корзина пуста</div>
  <SelectPaymentTypeModal
    :types="paymentTypes"
    v-model="selectedPaymentTypeModal"
    :current-type="selectedPaymentType"
    @select="selectedPaymentType = $event"
  />
  <DeliveryAddressesModal
    @address-selected="changeDeliveryAddress($event)"
    v-model="deliveryAddressesModal"
  />
</template>
<script lang="ts" setup>
import moment from 'moment'
import CButton from 'src/components/template/buttons/CButton.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { AvailableHours, CartType } from 'src/models/carts/cart'
import { cartRepo } from 'src/models/carts/cartRepo'
import { PaymentType, PaymentObjectType } from 'src/models/order/order'
import {
  beautifyNumber,
  getTimesBetween,
  store,
  totalDayTimes,
} from 'src/models/store'
import { ref, computed, onMounted, watch } from 'vue'
import SelectPaymentTypeModal from './SelectPaymentTypeModal.vue'
import { salesPointRepo } from 'src/models/salesPoint/salesPointRepo'
import { Notify } from 'quasar'
import { padRepo } from 'src/models/pads/padRepo'
import { useRouter } from 'vue-router'
import { orderRepo } from 'src/models/order/orderRepo'
import DeliveryAddressesModal from 'src/components/template/dialogs/DeliveryAddressesModal.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { deliveryAreaRepo } from 'src/models/deliveryAreas/deliveryAreaRepo'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import RoundedSelector from 'src/components/template/buttons/RoundedSelector.vue'

const currentDay = ref('Сегодня')

const availableHours = ref<AvailableHours | null>(null)

const timeBlockMobileSpot = ref<HTMLDivElement>()

const selectedPaymentType = ref<PaymentObjectType | null>(null)

const selectedPaymentTypeModal = ref(false)

const loading = ref(false)

const router = useRouter()

const deliveryAddressesModal = ref(false)

const menu = ref(false)

const menuRef = ref<HTMLDivElement | null>(null)

const mobileViewSelectedTime = computed(() => {
  if (!cartRepo.item) return
  return cartRepo.item.deliveryTime
    ? cartRepo.item.deliveryTime.slice(0, 5) +
        ' ' +
        cartRepo.item.deliveryTime.slice(11, 16)
    : '~ 10 мин'
})

const isArrangeAvailable = computed(() => {
  return (
    !!selectedPaymentType.value &&
    cartRepo.item?.cartItems.every(
      (v) =>
        !v.isDead &&
        (v.availableQuantity ? v.quantity <= v.availableQuantity : true),
    )
  )
})

const isDelivery = computed(() => {
  return cartRepo.item?.type === CartType.DELIVERY
})

const availableTimes = computed(() => {
  return currentDay.value === 'Сегодня'
    ? availableHours.value?.today.flatMap((v) => {
        return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
      })
    : availableHours.value?.tomorrow.flatMap((v) => {
        return getTimesBetween(v.start.slice(11, 16), v.end.slice(11, 16))
      })
})

// const options = computed(() => {
//   return currentDay.value === 'Сегодня'
//     ? availableHours.value?.today.map((v) => {
//         return {
//           start: moment(v.start, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//           end: moment(v.end, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//         }
//       })
//     : availableHours.value?.tomorrow.map((v) => {
//         return {
//           start: moment(v.start, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//           end: moment(v.end, 'YYYY-MM-DD HH:mm').format('HH:mm'),
//         }
//       })
// })

const paymentTypes = computed(() => {
  const result: PaymentObjectType[] = []
  if (store.tableMode) {
    result.push({
      label: 'Внести в счет',
      type: PaymentType.PAY_LATER,
      class: 'bg-cash-button-color text-on-cash-button-color',
      icon: 'fa-light fa-money-bill',
    })
    if (salesPointRepo.paymentSettings?.online_payment_enabled) {
      result.push({
        label: 'Онлайн',
        type: PaymentType.ONLINE,
        class: 'bg-cash-button-color text-on-cash-button-color',
        icon: 'fa-light fa-ruble-sign',
      })
    }
  } else {
    if (salesPointRepo.paymentSettings?.cash_enabled)
      result.push({
        label: 'Наличными при получении',
        type: PaymentType.CASH,
        class: 'bg-cash-button-color text-on-cash-button-color',
        icon: 'fa-light fa-money-bill',
      })
    if (salesPointRepo.paymentSettings?.card_enabled)
      result.push({
        label: 'Картой при получении',
        type: PaymentType.CARD,
        class: 'bg-card-button-color text-on-card-button-color',
        icon: 'fa-light fa-credit-card',
      })
    if (salesPointRepo.paymentSettings?.online_payment_enabled)
      result.push({
        label: 'Онлайн',
        type: PaymentType.ONLINE,
        class: 'bg-online-button-color text-on-online-button-color',
        icon: 'fa-light fa-ruble-sign',
      })
  }
  return result
})

watch(
  () => menu.value,
  (v) => {
    if (v) {
      setTimeout(() => {
        if (!availableTimes.value || !menuRef.value) return
        const foundTimeElement = menuRef.value.getElementsByClassName(
          availableTimes.value[0],
        )
        if (foundTimeElement) {
          foundTimeElement[0].scrollIntoView()
        }
      }, 0)
    }
  },
)

const selectClosestTime = async () => {
  if (!cartRepo.item) return
  cartRepo.item.deliveryTime = null
  await cartRepo.setParams({
    delivery_time: cartRepo.item?.deliveryTime
      ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')
      : null,
  })
  // if (availableHours.value?.today.length) {
  //   cartRepo.item.deliveryTime = moment(
  //     availableHours.value.today[0].start
  //   ).format('DD.MM.YYYY HH:mm')
  // } else {
  //   cartRepo.item.deliveryTime =
  //     moment(availableHours.value?.tomorrow[0].start).format(
  //       'DD.MM.YYYY HH:mm'
  //     ) || null
  // }
}

const setDeliveryTime = async (v: string | null) => {
  if (!cartRepo.item) return
  if (v && !availableTimes.value?.includes(v)) return
  const today = moment().format('DD.MM.YYYY')
  const tomorrow = moment().add(1, 'day').format('DD.MM.YYYY')

  if (currentDay.value === 'Сегодня') {
    cartRepo.item.deliveryTime = [today, v].join(' ')
  } else {
    cartRepo.item.deliveryTime = [tomorrow, v].join(' ')
  }
  menu.value = false
  await cartRepo.setParams({
    delivery_time: cartRepo.item?.deliveryTime
      ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
          .utc()
          .format('YYYY-MM-DD HH:mm:ss')
      : null,
  })
}

const makeAnOrder = async () => {
  try {
    loading.value = true
    const status = await salesPointRepo.status(cartRepo.item?.salesPoint.id)
    if (!status) {
      Notify.create({
        message: 'В данный момент невозможно оформить заказ',
        color: 'danger',
      })
      return
    }

    await cartRepo.setParams({
      delivery_time: cartRepo.item?.deliveryTime
        ? moment(cartRepo.item?.deliveryTime, 'DD.MM.YYYY HH:mm')
            .utc()
            .format('YYYY-MM-DD HH:mm:ss')
        : null,
      comment: cartRepo.item?.comment || undefined,
    })
    const order = await cartRepo.arrange({
      sales_point: cartRepo.item?.salesPoint.id,
      payment_data: {
        type: selectedPaymentType.value?.type,
        payment_service:
          selectedPaymentType.value?.type === PaymentType.CASH ||
          selectedPaymentType.value?.type === PaymentType.PAY_LATER
            ? undefined
            : selectedPaymentType.value?.type === PaymentType.CARD
              ? 'card'
              : 'web_form',
      },
      extra_data: {
        system_source: 'website',
      },
      pad: store.tableMode ? padRepo.item?.id : undefined,
    })
    if (store.tableMode) {
      await cartRepo.current(
        padRepo.item?.salesPoint?.id,
        padRepo.item || undefined,
      )
      void router.push({
        name: 'currentOrderPage',
      })
    } else {
      cartRepo.item = null
      void router.push({
        name: 'successOrderPage',
        params: {
          orderId: order.id,
        },
      })
    }
    if (order.paymentUrl) {
      window.open(order.paymentUrl, '_blank')
    }
    Notify.create({
      message: 'Заказ успешно оформлен',
    })
    orderRepo.item = order
  } catch {
    cartRepo.arrangeLoading = false
    Notify.create({
      message: 'Ошибка при оформлении заказа',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}

const changeDeliveryAddress = async (address: DeliveryAddress) => {
  if (address.id === cartRepo.item?.deliveryAddress?.id) {
    deliveryAddressesModal.value = false
    return
  }
  const res = await deliveryAreaRepo.byCoords([
    address.coords?.latitude || 0,
    address.coords?.longitude || 0,
  ])
  if (!res.length) {
    Notify.create({
      message: 'По данному адресу не осуществляется доставка',
      color: 'danger',
    })
    deliveryAddressesModal.value = false
    return
  }
  try {
    await cartRepo.setParams({
      sales_point: res[0].salesPoint,
      type: 'delivery',
      delivery_address: address.id,
    })
  } catch {
    Notify.create({
      message: 'Ошибка',
      color: 'danger',
    })
  } finally {
    deliveryAddressesModal.value = false
  }
}

onMounted(() => {
  void cartRepo.getAvailableHours(cartRepo.item?.salesPoint.id).then((res) => {
    availableHours.value = res
  })
  void deliveryAddressRepo.list()

  void salesPointRepo.getAvailablePayments(cartRepo.item?.salesPoint.id)
  const foundOnlinePaymentType = paymentTypes.value.find(
    (v) => v.type === PaymentType.ONLINE,
  )
  if (foundOnlinePaymentType) {
    selectedPaymentType.value = foundOnlinePaymentType
  } else {
    selectedPaymentType.value = paymentTypes.value[0]
  }
})
</script>

<style lang="scss" scoped>
.input :deep(.q-field--standout.q-field--readonly .q-field__control:before) {
  border: unset;
}

.selected-element {
  outline: 2px var(--primary) solid !important;
}

.dimmed {
  filter: grayscale(90%);
}

.selected-time {
  border: 2px var(--primary) solid;
}

.bordered-block {
  outline: 1px var(--secondary) solid;
}
</style>
