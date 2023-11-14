<template>
  <div v-if="$cart.item" class="px-10 column pb-10">
    <div
      v-if="authentication.user && $cart.item.walletPayments.length"
      class="column full-width gap-8 mb-15"
    >
      <WalletSlider
        v-for="(el, index) in $cart.item.walletPayments"
        :key="index"
        :item="el"
        @apply="applyClickHandler(el)"
      />
    </div>

    <div class="column">
      <div class="header2 mb-10">Итого</div>

      <div class="box-shadow border-radius py-6 px-5 column gap-7">
        <div
          v-for="(el, index) in resultRows"
          :key="index"
          class="row items-center no-wrap justify-between"
        >
          <div class="row gap-5 no-wrap items-center">
            <div class="bg-white-opacity box-shadow border-radius px-6 py-5">
              <CIcon
                :color="index === 3 ? 'primary' : 'on-background-color'"
                :name="el.icon"
              />
            </div>
            <div
              :class="index === 3 ? 'text-primary' : 'text-on-background-color'"
              class="secondary-text"
            >
              {{ el.label }}
            </div>
          </div>
          <div
            :class="index === 3 ? 'text-primary' : 'text-on-background-color'"
            class="secondary-text"
          >
            {{ el.value || '0' }} ₽
          </div>
        </div>
      </div>

      <div
        v-if="
          $cart.item.salesPoint.settings.promo_codes !== PromoCodeMode.DISABLED
        "
        class="row items-end gap-5 mt-10"
      >
        <CInput
          v-model="promocode"
          default
          class="body col-grow"
          height="50px"
          external-label="Промокод"
        />
        <CButton
          @click="applyPromocode()"
          height="50px"
          :loading="$cart.loading"
          :disabled="!promocode?.length"
          class="body"
          label="Применить"
        />
      </div>
      <!-- <CInput
        :model-value="$cart.item.deliveryTime"
        class="mt-10"
        default
        height="50px"
        external-label="Время доставки"
      >
        <q-menu
          ><q-time
            :options="dateOptions"
            :model-value="deliveryTyme"
            @update:model-value="setDeliveryTime($event)"
          >
            <TabPicker
              @update-tab="currentDay = $event"
              :tabs="['Сегодня', 'Завтра']"
              :model-value="currentDay"
            /> </q-time
        ></q-menu>
      </CInput> -->
      <TimePicker
        label="Время доставки"
        :options="options"
        @update-time="setDeliveryTime($event)"
        height="50px"
        class="mt-10"
        :day="currentDay"
        :date="$cart.item.deliveryTime"
      >
        <TabPicker
          class="px-5 pt-5"
          small
          @update-tab="currentDay = $event"
          :tabs="['Сегодня', 'Завтра']"
          :model-value="currentDay"
      /></TimePicker>

      <div v-if="showPaymentTypes" class="row full-width gap-8 mt-15">
        <div
          v-for="(type, index) in paymentTypes"
          :key="index"
          @click="$emit('paymentSelected', type.type)"
          style="max-width: 50%"
          class="col border-radius px-5 pt-10 pb-5 cursor-pointer relative-position"
          :class="type.class"
        >
          <div
            class="column justify-between full-height"
            :style="`visibility: ${
              $cart.arrangeLoading ? 'hidden' : 'visible'
            }`"
          >
            <div class="subtitle-text">
              {{ type.label }}
            </div>
            <div class="row mt-3 full-width justify-end">
              <div
                style="height: 30px; width: 30px"
                class="bg-white-opacity box-shadow row justify-center items-center border-radius"
              >
                <CIcon color="" :name="type.icon" />
              </div>
            </div>
          </div>
          <q-spinner-puff
            v-if="$cart.arrangeLoading"
            class="absolute-center"
            color="primary"
            size="50%"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CButton from 'src/components/template/buttons/CButton.vue'
import TabPicker from 'src/components/template/buttons/TabPicker.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { authentication } from 'src/models/authentication/authentication'
import { cartRepo } from 'src/models/carts/cartRepo'
import { computed, ref, onMounted, watch } from 'vue'
import { AvailableHours } from 'src/models/carts/cart'
import moment from 'moment'
import { PaymentType } from 'src/models/order/order'
import { Notify } from 'quasar'
import { sum } from 'lodash'
import WalletSlider from './WalletSlider.vue'
import { WalletPaymentRaw } from 'src/models/carts/cart'
import { PromoCodeMode } from 'src/models/salesPoint/salesPoint'
import TimePicker from 'src/components/inputs/TimePicker.vue'

defineProps<{
  showPaymentTypes: boolean
}>()

defineEmits<{
  (evt: 'paymentSelected', val: PaymentType): void
}>()

const currentDay = ref('Сегодня')

const deliveryTyme = ref<string | null>(null)

const promocode = ref<string | null>(null)

const availableHours = ref<AvailableHours | null>(null)

watch(
  () => cartRepo.item?.promoCode,
  (v) => {
    if (!promocode.value?.length) return
    promocode.value = v || null
    if (!v) {
      Notify.create({
        message: 'Введенный Вами промокод неверен или недействителен',
        color: 'danger',
      })
    }
  }
)

const paymentTypes = computed(() => {
  const result = []
  if (cartRepo.item?.salesPoint.paymentSettings.cash_enabled)
    result.push({
      label: 'Наличными при получении',
      type: PaymentType.CASH,
      class: 'bg-cash-button-color text-on-cash-button-color',
      icon: 'fa-light fa-money-bill',
    })
  if (cartRepo.item?.salesPoint.paymentSettings.card_enabled)
    result.push({
      label: 'Картой при получении',
      type: PaymentType.CARD,
      class: 'bg-card-button-color text-on-card-button-color',
      icon: 'fa-light fa-credit-card',
    })
  if (cartRepo.item?.salesPoint.paymentSettings.online_payment_enabled)
    result.push({
      label: 'Онлайн',
      type: PaymentType.ONLINE,
      class: 'bg-online-button-color text-on-online-button-color',
      icon: 'fa-light fa-dollar',
    })
  return result
})

const usedPoints = computed(() => {
  return sum(cartRepo.item?.walletPayments.map((v) => v.applied_sum))
})

const resultRows = computed(() => {
  return [
    {
      label: 'Сумма заказа',
      icon: 'fa-light fa-user',
      value: cartRepo.item?.discountedSum,
    },
    {
      label: 'Списать баллов',
      icon: 'fa-light fa-piggy-bank',
      value: usedPoints.value ? '—' + usedPoints.value : 0,
    },
    {
      label: 'Доставка',
      icon: 'fa-light fa-truck',
      value: cartRepo.item?.deliveryPrice,
    },
    {
      label: 'К оплате',
      icon: 'fa-light fa-credit-card-blank',
      value: cartRepo.item?.discountedTotalSum.toFixed(2),
    },
  ]
})

const options = computed(() => {
  return currentDay.value === 'Сегодня'
    ? availableHours.value?.today.map((v) => {
        return {
          start: moment(v.start, 'YYYY-MM-DD HH:mm').format('HH:mm'),
          end: moment(v.end, 'YYYY-MM-DD HH:mm').format('HH:mm'),
        }
      })
    : availableHours.value?.tomorrow.map((v) => {
        return {
          start: moment(v.start, 'YYYY-MM-DD HH:mm').format('HH:mm'),
          end: moment(v.end, 'YYYY-MM-DD HH:mm').format('HH:mm'),
        }
      })
})

// const dateOptions = (hr: number, min: number | null) => {
//   if (!availableHours.value) return
//   for (const v of currentDay.value === 'Сегодня'
//     ? availableHours.value?.today
//     : availableHours.value.tomorrow) {
//     const startTime = moment
//       .utc(v.start, 'YYYY-MM-DD HH:mm:ss')
//       .local()
//       .format('HH:mm')
//     const endTime = moment
//       .utc(v.end, 'YYYY-MM-DD HH:mm:ss')
//       .local()
//       .format('HH:mm')

//     const startHour = Number(startTime.split(':')[0])
//     const endHour = Number(endTime.split(':')[0])
//     const startMin = Number(startTime.split(':')[1])
//     const endMin = Number(endTime.split(':')[1])

//     if (hr < startHour) return false
//     if (hr > endHour) return false
//     if (min !== null && hr === startHour && min < startMin) return false
//     if (min !== null && hr === endHour && min > endMin) return false
//     return true
//   }
// }

const applyPromocode = async () => {
  if (!cartRepo.item) return
  try {
    cartRepo.loading = true
    await cartRepo.setParams({
      promo_code: promocode.value || undefined,
    })
  } catch {}
}

const applyClickHandler = async (wallet: WalletPaymentRaw) => {
  try {
    await cartRepo.setParams({
      sales_point: cartRepo.item?.salesPoint.id,
      type: cartRepo.item?.type,
      applied_wallet_payments: [
        {
          wallet_payment: wallet.uuid,
          applied_sum: wallet.applied_sum,
        },
      ],
    })
    Notify.create({
      message: 'Бонусы успешно использованы',
    })
  } catch {
    Notify.create({
      message: 'Ошибка при применении бонусов',
      color: 'danger',
    })
  }
}

const setDeliveryTime = (v: string | null) => {
  if (!cartRepo.item) return
  const today = moment().format('DD.MM.YYYY')
  const tomorrow = moment().add(1, 'day').format('DD.MM.YYYY')
  if (v === 'error') {
    cartRepo.item.deliveryTime = 'Не указано'
  } else {
    if (currentDay.value === 'Сегодня') {
      cartRepo.item.deliveryTime = [today, v].join(' ')
    } else {
      cartRepo.item.deliveryTime = [tomorrow, v].join(' ')
    }
  }
}

onMounted(() => {
  void cartRepo.getAvailableHours().then((res) => {
    availableHours.value = res
  })
  if (cartRepo.item?.deliveryTime) {
    deliveryTyme.value = moment(
      cartRepo.item.deliveryTime,
      'DD.MM.YYYY HH:mm:ss'
    ).format('HH:mm')
  }
})
</script>

<style lang="scss" scoped></style>
