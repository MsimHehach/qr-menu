<template>
  <div
    v-if="$deliveryAddress.items.length"
    :style="$q.screen.xs ? '' : 'max-width: 416px;'"
    style="width: 100%; height: fit-content"
    class="column px-5 bg-backing-color border-radius text-on-backing-color"
  >
    <template v-for="(el, index) in $deliveryAddress.items" :key="index">
      <q-separator v-if="index" />
      <div class="row full-width items-center no-wrap my-7 justify-between">
        <div class="column gap-6 col-6">
          <div class="bold body">{{ el.name }}</div>
          <div class="ellipsis-2-lines secondary-text">{{ el.address }}</div>
        </div>
        <CIcon
          @click="selectAddressToEdit(el)"
          size="19px"
          class="cursor-pointer"
          hover-color="primary"
          color="on-backing-color"
          name="fa-light fa-pen-to-square"
        />
      </div>
    </template>
  </div>
  <div
    v-else
    :style="$q.screen.xs ? '' : 'width: 416px;'"
    style="min-height: 200px"
    class="bg-backing-color text-on-backing-color border-radius box-shadow column no-wrap justify-center items-center gap-10"
  >
    <CIcon
      color="on-backing-color"
      name="fa-thin fa-location-plus"
      size="65px"
    />
    <div class="row full-width justify-center">
      <div class="header3 col-9" style="text-align: center">
        У вас нет добавленных адресов доставки
      </div>
    </div>
  </div>
  <div class="row full-width mt-15">
    <div
      :style="$q.screen.xs ? '' : 'max-width: 416px;'"
      style="width: 100%"
      class="row justify-center"
    >
      <CButton
        width="280px"
        height="50px"
        label="Добавить адрес"
        @click="deliveryAddressModal = true"
      />
    </div>
  </div>
  <Pagination
    :loading="$deliveryAddress.loadings.list"
    class="px-10 mt-15 full-width"
    @update:modelValue="setPage($event)"
    @appendItems="setPage($event, true)"
    :page="$deliveryAddress.pagination.page"
    :last-page="$deliveryAddress.pagination.last_page"
  ></Pagination>
  <DeliveryAddressModal
    :model-value="deliveryAddressModal"
    :address="addressToEdit || undefined"
    @update:model-value="deliveryAddressModalCloseHandler()"
    @create="deliveryAddressCreated()"
  />
</template>
<script lang="ts" setup>
import Pagination from 'src/components/inputs/Pagination.vue'
import DeliveryAddressModal from 'src/pages/profile/DeliveryAddressModal.vue'
import CIcon from 'src/components/template/helpers/CIcon.vue'
import { DeliveryAddress } from 'src/models/customer/deliveryAddress/deliveryAddress'
import { deliveryAddressRepo } from 'src/models/customer/deliveryAddress/deliveryAddressRepo'
import { onMounted, ref } from 'vue'
import CButton from 'src/components/template/buttons/CButton.vue'
import { authentication } from 'src/models/authentication/authentication'

const deliveryAddressModal = ref(false)

const addressToEdit = ref<DeliveryAddress | null>(null)

const deliveryAddressCreated = async () => {
  deliveryAddressModal.value = false
  await loadAddresses()
}

const deliveryAddressModalCloseHandler = () => {
  addressToEdit.value = null
  deliveryAddressModal.value = false
}

const selectAddressToEdit = (v: DeliveryAddress) => {
  addressToEdit.value = v
  deliveryAddressModal.value = true
}

const setPage = async (page = 1, appendItems = false) => {
  await loadAddresses(page, appendItems)
}

const loadAddresses = async (page = 1, appendItems = false) => {
  await deliveryAddressRepo.list(
    {},
    {
      page: page ? page : deliveryAddressRepo.pagination.page,
      appendItems: appendItems,
      pageSize: 10,
    }
  )
}

onMounted(() => {
  if (!authentication.user) return
  void loadAddresses()
})
</script>
