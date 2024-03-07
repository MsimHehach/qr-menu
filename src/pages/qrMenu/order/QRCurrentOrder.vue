<template>
  <div v-if="$order.item">
    <div class="column gap-3 bg-primary text-on-primary pa-5">
      <div class="header">
        {{ `Заказ № ${$order.item?.number || 'б/н'}` }}
      </div>
      <div class="subtitle-text light">
        {{ `от ${$order.item?.createdAt || ''}` }}
      </div>
    </div>
    <div class="column gap-8 px-5 pt-8 text-on-background-color">
      <div class="row gap-5 no-wrap items-center">
        <q-icon name="fa-light fa-timer" size="20px" />
        <div class="bold">Статус заказа:</div>
        <CBadge
          color="primary"
          text-color="on-primary"
          class="body cursor-pointer"
          style="line-height: 100%"
        >
          {{ $order.item.orderStatus?.name }}
        </CBadge>
      </div>

      <div class="row items-center gap-5 no-wrap">
        <q-icon name="fa-light fa-cash-register" size="20px" />
        <div class="bold">Статус оплаты:</div>

        <div>
          <CBadge
            color="primary"
            text-color="on-primary"
            class="body"
            style="line-height: 100%"
            >{{ $order.item.getPaymentStatus?.label }}
          </CBadge>
        </div>
      </div>
      <div class="row gap-5 no-wrap items-center">
        <q-icon name="fa-light fa-money-check-pen" size="20px" />
        <div class="bold">Тип оплаты:</div>
        <CBadge v-if="$order.item.paymentType" color="primary">
          <div class="row no-wrap items-center gap-4 body text-on-primary">
            <!-- <CIcon
              size="14px"
              :name="$order.item.getPaymentType?.icon"
              color="on-primary"
            /> -->
            {{ $order.item.getPaymentType?.label }}
          </div>
        </CBadge>
        <div v-else>Не указан</div>
      </div>
      <div class="bold">Заказанные блюда:</div>
      <div class="column gap-5 full-width body">
        <template v-for="(item, index) in $order.item.items" :key="index">
          <q-separator v-if="index" />
          <div class="row no-wrap gap-5 items-center">
            <q-img
              class="rounded-5"
              :src="item.size.image?.thumbnail || $store.images.empty"
              width="45px"
              height="45px"
              style="min-width: 45px"
              fit="cover"
            >
              <template v-slot:error>
                <span>
                  <q-img
                    class="user-image"
                    fit="cover"
                    width="45px"
                    style="min-width: 45px"
                    height="45px"
                    :src="$store.images.empty"
                  ></q-img>
                </span>
              </template>
            </q-img>
            <div class="column gap-2 col">
              <div class="ellipsis-2-lines">
                {{ item.size.name }}
              </div>
              <div class="row full-width justify-between">
                <div>
                  {{ item.quantity }} x {{ beautifyNumber(item.price, true) }}
                </div>
                <div class="column items-end">
                  <div v-if="item.total_sum < item.sum">
                    {{ beautifyNumber(item.total_sum, true) }} ₽
                  </div>
                  <div :class="{ 'text-strike': item.total_sum < item.sum }">
                    {{ beautifyNumber(item.sum, true) }} ₽
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div
        v-if="$order.item.paymentType === PaymentType.PAY_LATER"
        class="column gap-10"
      >
        <!-- <CSelect
          :items="paymentTypes.filter((v) => v.value !== PaymentType.PAY_LATER)"
          item-value="value"
          item-label="label"
          external-label="Тип оплаты"
          :model-value="
            currentPaymentType
              ? paymentTypeNames[currentPaymentType]
              : undefined
          "
          @update:model-value="currentPaymentType = $event.value"
        /> -->
        <div class="row full-width justify-center mt-10">
          <CButton
            @click="applyPayments()"
            style="max-width: 350px; width: 100%"
            :label="'Оплатить онлайн ' + $order.item.discountedTotalSum + ' ₽'"
            :loading="loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import CBadge from 'src/components/helpers/CBadge.vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { PaymentStatusType, PaymentType } from 'src/models/order/order'
import { beautifyNumber } from 'src/models/store'

import { Notify } from 'quasar'
import { orderRepo } from 'src/models/order/orderRepo'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)

const router = useRouter()

watch(
  () => orderRepo.item?.paymentStatus,
  (v) => {
    if (v !== PaymentStatusType.NOT_PAID) {
      void router.push({
        name: 'orderReviewPage',
      })
    }
  }
)

const applyPayments = async () => {
  try {
    loading.value = true
    const res = await orderRepo.applyPayments({
      type: PaymentType.ONLINE,
      payment_service: 'web_form',
    })
    orderRepo.item = res
    if (res.paymentUrl) {
      window.open(res.paymentUrl, '_blank')
    }
  } catch {
    Notify.create({
      message: 'Произошла ошибка при оплате закза',
      color: 'danger',
    })
  } finally {
    loading.value = false
  }
}
</script>
