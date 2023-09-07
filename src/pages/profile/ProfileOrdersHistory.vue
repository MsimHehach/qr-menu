<template>
  <div class="full-width">
    <div class="row items-center gap-4 body">
      <div
        v-for="(el, index) in orderTypes"
        :key="index"
        @click="changeOrdersFilterType(el.val)"
        :class="
          el.val === currentType
            ? 'bg-primary text-on-primary border-radius'
            : 'text-on-background-color'
        "
        class="cursor-pointer px-6 py-3"
      >
        {{ el.label }}
      </div>
    </div>
    <div
      class="column mt-15 gap-10"
      :style="$q.screen.xs ? '' : 'max-width: 550px'"
    >
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
        style="height: 200px"
        class="bg-backing-color text-on-backing-color border-radius box-shadow column justify-center items-center gap-10"
      >
        <CIcon
          color="on-backing-color"
          name="fa-thin fa-money-check"
          size="75px"
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
  <div
    v-if="$order.loadings.list"
    style="height: 100vh"
    class="absolute-full flex items-center justify-center"
  >
    <q-spinner-puff color="primary" size="10%" />
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
