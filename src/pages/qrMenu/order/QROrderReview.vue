<template>
  <div v-if="item">
    <div class="column gap-3 bg-primary text-on-primary pa-5">
      <div class="header">
        {{ `Отзыв к заказу № ${$order.item?.number || 'б/н'}` }}
      </div>
      <div class="subtitle-text light">
        {{ `от ${$order.item?.createdAt || ''}` }}
      </div>
    </div>
    <div class="column text-on-background-color full-width gap-15 c-container">
      <div class="column full-width gap-8 items-center mt-20">
        <div class="header">Оценка</div>
        <q-rating v-model="item.rating" size="3em" :max="5" color="primary" />
      </div>
      <CInput v-model="item.comment" external-label="Комментарий" text-area />
      <div class="row full-width justify-center">
        <CButton
          @click="createReview()"
          label="Отправить"
          style="max-width: 350px; width: 100%"
          :disabled="!item.rating"
          :loading="$orderReview.loadings.create"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { Notify } from 'quasar'
import CButton from 'src/components/template/buttons/CButton.vue'
import CInput from 'src/components/template/inputs/CInput.vue'
import { orderRepo } from 'src/models/order/orderRepo'
import { OrderReview } from 'src/models/order/orderReview/orderReview'
import { orderReviewRepo } from 'src/models/order/orderReview/orderReviewRepo'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const item = ref<OrderReview | null>(null)

const router = useRouter()

onMounted(() => {
  if (orderRepo.item?.review) {
    void orderReviewRepo.retrieve(orderRepo.item?.review).then((res) => {
      item.value = cloneDeep(res)
    })
  } else {
    item.value = new OrderReview({
      order: orderRepo.item?.id || null,
    })
  }
})

const createReview = async () => {
  try {
    await orderReviewRepo.create(item.value)
    Notify.create({
      message: 'Отзыв успешно создан',
    })
    void router.push({
      name: 'qrHome',
    })
  } catch {
    Notify.create({
      message: 'Ошибка при создании отзыва',
      color: 'danger',
    })
  }
}
</script>
