<template>
  <div
    :style="`max-width: ${$q.screen.lt.lg ? '' : '628px'}`"
    class="column full-width text-on-background-color"
  >
    <div class="header3 bold mb-15">История заказов</div>
    <div
      class="row items-center full-width gap-4 body no-wrap pt-1 pb-2 pr-1"
      style="overflow-x: auto"
    >
      <div
        v-for="(el, index) in orderTypes"
        :key="index"
        @click="changeOrdersFilterType(el.val)"
        :class="
          el.val === currentType
            ? 'bg-secondary text-on-secondary bold'
            : 'text-on-background-color bordered-type'
        "
        class="cursor-pointer px-10 body py-6 border-radius2"
      >
        {{ el.label }}
      </div>
    </div>
    <div class="column mt-15 gap-10 full-width">
      <template v-if="$order.items.length">
        <ProfileOrderRow
          v-for="(order, index) in $order.items"
          :key="index"
          :order="order"
        />
      </template>
      <div
        v-else
        :style="$q.screen.xs ? '' : 'width: 416px'"
        style="min-height: 180px"
        class="text-on-background-color border-radius bordered-type column justify-center items-center gap-5"
      >
        <CIcon
          color="on-on-background-color"
          name="fa-light fa-money-check"
          size="60px"
        />
        <div class="header3">У вас нет ни одного заказа</div>
      </div>
    </div>
    <Pagination
      :loading="$order.loadings.list"
      class="px-10 mt-15"
      @update:modelValue="setPage($event)"
      @appendItems="setPage($event, true)"
      :page="$order.pagination.page"
      :last-page="$order.pagination.last_page"
    ></Pagination>
  </div>
</template>
<script lang="ts" setup>
import { orderRepo } from 'src/models/order/orderRepo'
import { onMounted, ref } from 'vue'
import Pagination from 'src/components/inputs/Pagination.vue'
import ProfileOrderRow from './ProfileOrderRow.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { authentication } from 'src/models/authentication/authentication'

type OrderType = 'all' | 'pickup' | 'delivery' | 'booking'

const currentType = ref<OrderType>('all')

const setPage = async (page = 1, appendItems = false) => {
  await loadOrders(page, appendItems)
}

const loadOrders = async (page = 1, appendItems = false) => {
  await orderRepo.list(
    {
      type: currentType.value === 'all' ? undefined : currentType.value,
    },
    {
      page: page ? page : orderRepo.pagination.page,
      appendItems: appendItems,
      pageSize: 10,
    }
  )
}

const changeOrdersFilterType = async (type: OrderType) => {
  currentType.value = type
  await loadOrders()
}

onMounted(async () => {
  if (!authentication.user) return
  await loadOrders()
})

const orderTypes = ref<
  {
    label: string
    val: OrderType
  }[]
>([
  {
    label: 'Все',
    val: 'all',
  },
  {
    label: 'Самовывоз',
    val: 'pickup',
  },
  {
    label: 'Доставка',
    val: 'delivery',
  },
  {
    label: 'Бронь',
    val: 'booking',
  },
])
</script>

<style lang="scss" scoped>
.bordered-type {
  border: 1px var(--secondary) solid;
}
</style>
